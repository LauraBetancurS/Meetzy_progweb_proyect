import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { createPollThunk, voteInPollThunk, updatePollVotes } from '../../redux/slices/PollsSlice';
import type { PollModel } from '../../types/Poll';
import './Poll.css';
import PrimaryButton from '../UI/PrimaryButton';

interface PollProps {
  poll?: PollModel;
  communityId: string;
  onPollCreated?: () => void;
}

export default function Poll({ poll, communityId, onPollCreated }: PollProps) {
  const dispatch = useAppDispatch();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [voted, setVoted] = useState(false);
  const [isCreating, setIsCreating] = useState(!poll);

  const totalVotes = poll?.options.reduce((sum, opt) => sum + opt.voteCount, 0) || 0;

  async function handleCreatePoll(e: React.FormEvent) {
    e.preventDefault();
    if (!question || options.some(opt => !opt.trim())) return;

    const filteredOptions = options.filter(opt => opt.trim());
    await dispatch(createPollThunk({
      question,
      options: filteredOptions,
      communityId
    }));

    setQuestion('');
    setOptions(['', '']);
    setIsCreating(false);
    onPollCreated?.();
  }

  async function handleVote(optionId: string) {
    if (!poll || voted) return;

    try {
      const res = await dispatch(voteInPollThunk({ pollId: poll.id, optionId })).unwrap();
     
      if (res?.voteCount !== undefined && res?.voteCount !== null) {
        dispatch((updatePollVotes)({ pollId: poll.id, optionId, voteCount: res.voteCount }));
      }

      setVoted(true);
    } catch (err) {
     console.log(err);
     
      
    }
  }

  function addOption() {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  }

  function updateOption(index: number, value: string) {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  if (isCreating) {
    return (
      <div className="poll poll--create">
        <form onSubmit={handleCreatePoll}>
          <input
            type="text"
            placeholder="¿Cuál es tu pregunta?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="poll__question-input"
          />
          
          <div className="poll__options">
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Opción ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="poll__option-input"
              />
            ))}
          </div>
          
          {options.length < 5 && (
            <button 
              type="button" 
              onClick={addOption}
              className="poll__add-option"
            >
              + Agregar opción
            </button>
          )}
          
          <PrimaryButton 
            type="submit"
            disabled={!question || options.filter(opt => opt.trim()).length < 2}
          >
            Crear encuesta
          </PrimaryButton>
        </form>
      </div>
    );
  }

  if (!poll) return null;

  return (
    <div className="poll">
      <h3 className="poll__question">{poll.title}</h3>
      
      <div className="poll__options">
        {poll.options.map((option) => {
          const percentage = totalVotes ? Math.round((option.voteCount / totalVotes) * 100) : 0;
          
          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={voted}
              className={`poll__option ${voted ? 'poll__option--voted' : ''}`}
            >
              <div className="poll__option-text">
                <span>{option.text}</span>
                <span className="poll__option-votes">
                  {option.voteCount} votos ({percentage}%)
                </span>
              </div>
              
              <div className="poll__option-bar">
                <div 
                  className="poll__option-progress"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="poll__footer">
        <span>{totalVotes} votos totales</span>
        {poll.createdByProfile?.user_name && (
          <span>Creado por {poll.createdByProfile.user_name}</span>
        )}
      </div>
    </div>
  );
}