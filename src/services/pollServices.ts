import { supabase } from "./supabaseClient";
import type { NewPollInput, PollModel } from "../types/Poll";
import { RealtimeChannel } from "@supabase/supabase-js";

// Crear canalas por comunidad
const createPollChannel = (communityId: string): RealtimeChannel => {
  return supabase.channel(`polls:${communityId}`, {
    config: { 
      broadcast: { self: true },
      presence: { key: 'userCount' },
    },
  });
};

let activeChannel: RealtimeChannel | null = null;
// funcion para suscribirse a actualizaciones de votos en encuestas usaremos esto en le redux 
export const subscribeToPollUpdates = (
  communityId: string,
  onVoteUpdate: (pollId: string, optionId: string, newVoteCount: number) => void
) => {
  // Si ya estabas escuchando otro canal antes, te sales.
  if (activeChannel) {
    activeChannel.unsubscribe();
  }

  // Crear y suscribirlo al nuevo canal de la comunidad
  activeChannel = createPollChannel(communityId);
  
  activeChannel
    .on('broadcast', { event: 'vote' }, ({ payload }) => {
      const { pollId, optionId, voteCount } = payload;
      onVoteUpdate(pollId, optionId, voteCount);
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to polls in community ${communityId}`);
      }
    });

  return () => {
    if (activeChannel) {
      activeChannel.unsubscribe();
      activeChannel = null;
    }
  };
};

export async function createPoll(input: NewPollInput): Promise<{ data: PollModel | null; error?: string }> {
  try {
    const { data: poll, error: pollError } = await supabase
      .from('poll')
      .insert([
        {
          community_id: input.communityId,
          title: input.question,
          created_by: await supabase.auth.getUser().then(({ data }) => data.user?.id),
          options: input.options.map((text, index) => ({
            id: `${Date.now()}-${index}`,
            text,
            voteCount: 0
          }))
        }
      ])
      .select()
      .single();

    if (pollError) throw pollError;
    
    const pollModel: PollModel = {
      id: poll.id,
      communityId: poll.community_id,
      title: poll.title,
      options: poll.options,
      createdBy: poll.created_by,
      createdAt: poll.created_at,
    };

    return { data: pollModel };
  } catch (error) {
    console.error('Error creating poll:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
//registra el voto en la base de datos , register
export async function votePoll(
  pollId: string,
  optionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to vote');

    const { data: poll, error: pollError } = await supabase
      .from('poll')
      .select('options, voters')
      .eq('id', pollId)
      .single();
    
    if (pollError) throw pollError;

    // Check if user already voted
    const voters = poll.voters || {};
    if (voters[user.id]) {
      throw new Error('You have already voted in this poll');
    }

    // Mark user as voted for this option first
    //Registrar el voto del usuario,  Se crea una copia del objeto de votantes anterior y se agrega el nuevo vot
    const updatedVoters = {
      ...voters,[user.id]: {optionId,votedAt: new Date().toISOString()
      }
    };

    // Calculate vote count based on voters map (source of truth) //calcular votos
    const voteCounts: Record<string, number> = {};
    Object.entries(updatedVoters).forEach(([_, vote]) => {
      if (typeof vote === 'object' && vote && 'optionId' in vote) {
        const optionId = vote.optionId as string;
        voteCounts[optionId] = (voteCounts[optionId] || 0) + 1;
      }
    });

    // Update options with counts from voters
    const updatedOptions = poll.options.map((option: { id: string; text: string; voteCount: number }) => ({
      ...option,
      voteCount: voteCounts[option.id] || 0
    }));

    // Update the poll with new vote counts and voters
    console.log('[pollServices] updating poll', { pollId, optionId, updatedOptions, updatedVoters });
    //Dónde actualizas los votos en la BD
    const { error: updateError } = await supabase
      .from('poll')
      .update({
        options: updatedOptions, // aquí guardas los nuevos conteos
        voters: updatedVoters// y quién votó qué 
      })
      .eq('id', pollId);

    if (updateError) {
      console.error('[pollServices] updateError', updateError);
      throw updateError;
    }
    const { data: refreshed, error: refreshError } = await supabase
      .from('poll')
      .select('options, voters')
      .eq('id', pollId)
      .single();

    console.log('[pollServices] refreshed poll row', { pollId, refreshed, refreshError });

    if (refreshError) {
      // still broadcast best-effort from our updatedOptions  
      //aqui hacemos el broadcast...los demas suscritos se enteran del voto
      const bestEffortCount = updatedOptions.find((o: { id: string }) => o.id === optionId)?.voteCount || 0;
      if (activeChannel) {
        activeChannel.send({
          type: 'broadcast',
          event: 'vote',
          payload: { pollId, optionId, voteCount: bestEffortCount }
        });
      }
      return { success: true, voteCount: bestEffortCount } as any;
    }

    // Prefer counting voters map as the source of truth if available
    let authoritativeCount = 0;
    if (refreshed) {
      const voters = refreshed.voters || {};
      // voters is an object keyed by userId -> { optionId, votedAt }
      authoritativeCount = Object.values(voters).filter((v: any) => v.optionId === optionId).length;
      // fallback: if voters missing, try options.voteCount
      if (typeof authoritativeCount !== 'number' || authoritativeCount === 0) {
        authoritativeCount = (refreshed.options || []).find((o: any) => o.id === optionId)?.voteCount;
      }
      console.log('[pollServices] refreshed.voters', { pollId, voters });
    }
    console.log('[pollServices] authoritativeCount', { pollId, optionId, authoritativeCount });

    // Broadcast the authoritative vote count
    if (activeChannel) {
      activeChannel.send({
        type: 'broadcast',
        event: 'vote',
        payload: { pollId, optionId, voteCount: authoritativeCount }
      });
    }

    return { success: true, voteCount: authoritativeCount } as any;
  } catch (error) {
    console.error('Error voting on poll:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function fetchPollsByCommunity(communityId: string): Promise<{ data: PollModel[]; error?: string }> {
  try {
    const { data: polls, error: pollsError } = await supabase
      .from('poll')
      .select(`
        *,
        profiles:created_by (
          user_name,
          avatar_url
        )
      `)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });

    if (pollsError) throw pollsError;

    const pollModels: PollModel[] = polls.map(poll => ({
      id: poll.id,
      communityId: poll.community_id,
      title: poll.title,
      options: poll.options,
      createdBy: poll.created_by,
      createdAt: poll.created_at,
      createdByProfile: {
        user_name: poll.profiles?.user_name,
        avatar_url: poll.profiles?.avatar_url
      }
    }));

    return { data: pollModels };
  } catch (error) {
    console.error('Error fetching polls:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}