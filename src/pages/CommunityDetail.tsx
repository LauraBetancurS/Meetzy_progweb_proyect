import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  loadCommunityById,
  addMemberThunk,
  removeMemberThunk,
} from "../redux/slices/CommunitiesSlice";
import PrimaryButton from "../components/UI/PrimaryButton";
import "./CommunityDetail.css";
import TertiaryButton from "../components/UI/TertiaryButton";
import Composer from "../components/dashboard/composer/Composer";
import {
  createnewpost,
  fetchPostsByCommunity,
} from "../redux/slices/PostsSlices";
import { fetchPollsThunk, updatePollVotes } from "../redux/slices/PollsSlice";
import Poll from "../components/polls/Poll";
import { subscribeToPollUpdates } from "../services/pollServices";
import PromoBanner from "../components/dashboard/right/PromoBanner";
import { getprofileinfo } from "../services/usersService";

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((s) => s.auth);
  const { currentCommunity, loading, communities } = useAppSelector(
    (s) => s.communities
  );
  const community =
    currentCommunity || communities.find((c) => c.id === id);
  const events = useAppSelector((s) => s.events.events);
  const [showcreatepoll, setShowCreatePoll] = useState(false);

  const { posts } = useAppSelector((post) => post.posts);
  const { items: polls } = useAppSelector((state) => state.polls);

  useEffect(() => {
    if (!id) return;
    let unsubscribe: any;

    (async () => {
      try {
        // ensure the community is loaded before fetching dependent data
        await dispatch(loadCommunityById(id));
        await dispatch(fetchPostsByCommunity(id));
        await dispatch(fetchPollsThunk(id));
      } catch (err) {
        console.error("Failed to load community/posts/polls:", err);
      }

      // subscribe to realtime poll updates
      unsubscribe = subscribeToPollUpdates(
        id,
        (pollId: string, optionId: string, voteCount: number) => {
          dispatch(updatePollVotes({ pollId, optionId, voteCount }));
        }
      );
    })();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      } else if (unsubscribe && typeof unsubscribe.unsubscribe === "function") {
        unsubscribe.unsubscribe();
      } else if (unsubscribe && typeof unsubscribe.off === "function") {
        unsubscribe.off();
      }
    };
  }, [id, dispatch]);

  if (loading && !community) {
    return (
      <div className="communityDetail">
        <p>Cargando comunidad...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="communityDetail">
        <p>Comunidad no encontrada</p>
        <button onClick={() => navigate("/comunidades")}>Volver</button>
      </div>
    );
  }

  const isMember = user?.id && (community.memberIds || []).includes(user.id);
  const isCreator = !!user && !!community && user.id === community.owner_id;
  console.log(community.owner_id);

  const selectedEvents = events.filter((e) =>
    (community.selectedEventIds || []).includes(e.id)
  );

  async function handleJoinCommunity() {
    if (user?.id && community) {
      await dispatch(
        addMemberThunk({ communityId: community.id, userId: user.id })
      );
      if (id) {
        dispatch(loadCommunityById(id));
      }
    }
  }

  function Posts() {
    const [userImages, setUserImages] = useState<Record<string, string>>({});
    const [usernamestate, setusername] = useState<any>({});

    useEffect(() => {
      const fetchImages = async () => {
        const username: Record<string, string> = {};
        const images: Record<string, string> = {};

        for (const post of posts) {
          const profile = await getprofileinfo(post.createdBy);
          images[post.createdBy] = profile.avatarUrl || "";
          username[post.createdBy] = profile.user_name;
        }

        setUserImages(images);
        setusername(username);
      };
      fetchImages();
    }, [posts]);

    return posts.map((post) => (
      <div key={post.id} className="communityDetail__postcard">
        <div className="headerpostcard">
          <img
            className="imageavatarpost"
            src={userImages[post.createdBy] || ""}
            alt=""
          />
          <p>@{usernamestate[post.createdBy]}</p>
        </div>
        <p>{post.text}</p>
        {post.postImageUrl && (
          <img src={post.postImageUrl} alt="Post image" />
        )}
      </div>
    ));
  }

  async function handleLeaveCommunity() {
    if (user?.id && community) {
      await dispatch(
        removeMemberThunk({ communityId: community.id, userId: user.id })
      );
      if (id) {
        dispatch(loadCommunityById(id));
      }
    }
  }

  async function handlePost(payload: {
    text: string;
    communityId: string;
    postiamgeUrl?: string | null;
    createdById: string;
  }) {
    await dispatch(createnewpost(payload));
    if (id) {
      dispatch(loadCommunityById(id));
      dispatch(fetchPostsByCommunity(id));
    }
    console.log(payload);
  }

  return (
    <div className="communityDetail">
      <div className="leftsection">
        <div className="communityDetail__header">
          <img
            className="communityDetail__img"
            src={community.image_url}
            alt=""
          />
          <h1>{community.name}</h1>
          {community.description && (
            <p className="communityDetail__description">
              {community.description}
            </p>
          )}
          <div className="communityDetail__meta">
            <span>{community.members} miembros</span>
            <PrimaryButton
              onClick={() => {
                isCreator
                  ? navigate(`/comunidades/${community.id}/addmembers`)
                  : alert("Solo el creador puede agregar miembros");
              }}
              className="communityDetail__addBtn"
            >
              Agregar miembro
            </PrimaryButton>
            {isMember && (
              <TertiaryButton
                onClick={() =>
                  dispatch(
                    removeMemberThunk({
                      communityId: community.id,
                      userId: user?.id || "",
                    })
                  )
                }
                className="communityDetail__addBtn"
              >
                Abandonar comunidad
              </TertiaryButton>
            )}

            {!isMember && user && (
              <PrimaryButton onClick={handleJoinCommunity}>
                Unirse a la comunidad
              </PrimaryButton>
            )}
            {isMember && !isCreator && (
              <TertiaryButton onClick={handleLeaveCommunity}>
                Salir de la comunidad
              </TertiaryButton>
            )}
          </div>
        </div>

        <div className="communityDetail__content">
          {selectedEvents.map((event) => (
            <div key={event.id} className="communityDetail__eventCard">
              <img src={event.image_url ?? ""} alt="" />
              <h2>{event.name}</h2>
              <p>{event.description}</p>
            </div>
          ))}

          <section className="communityDetail__section">
            <h2>Publicaciones</h2>

            {/* Composer ARRIBA */}
            <Composer
              showpoll={() => {
                showcreatepoll
                  ? setShowCreatePoll(false)
                  : setShowCreatePoll(true);
              }}
              defaultCommunityId={community.id}
              hideCommunitySelector={true}
              onPost={handlePost}
            />

            {/* Bloque para crear encuesta (si es miembro y activó el toggle) */}
            {isMember && showcreatepoll === true && (
              <section className="communityDetail__section">
                <h2>Crea tu encuesta</h2>
                <Poll communityId={community.id} />
              </section>
            )}

            {/* Encuestas existentes */}
            {polls.map((poll) => (
              <Poll
                key={poll.id}
                poll={poll}
                communityId={community.id}
              />
            ))}

            {/* Publicaciones al final */}
            <div className="communityDetail__eventList">
              <Posts />
            </div>
          </section>
        </div>
      </div>

      <div className="rigthsection">
        <div className="communityDetail__related">
          <h2>comunidades relacionadas</h2>
          <hr />
          <div className="related__container">
            {communities ? (
              communities
                .filter((c) => c.id !== community.id)
                .slice(0, 5)
                .map((relatedCommunity) => (
                  <div
                    key={relatedCommunity.id}
                    className="communityDetail__relatedCard"
                    onClick={() =>
                      navigate(`/comunidades/${relatedCommunity.id}`)
                    }
                  >
                    <img
                      src={relatedCommunity.image_url}
                      alt={relatedCommunity.name}
                      height={40}
                      width={40}
                    />
                    <span>{relatedCommunity.name}</span>
                  </div>
                ))
            ) : (
              <div>no hay comunidades disponibles</div>
            )}
          </div>
        </div>

        <PromoBanner
          imageUrl="https://plus.unsplash.com/premium_photo-1723874670646-aa4750a25842?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFydHklMjBwZW9wbGV8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000"
          title="Tus momentos, siempre contigo"
          subtitle="Guarda, organiza y revive cada evento importante en un solo lugar."
          className=" "
        />
      </div>
    </div>
  );
}
