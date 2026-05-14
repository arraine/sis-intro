import { useState, useRef } from 'react';
import { CARDS, CATEGORIES, shuffle } from './cards.js';
import styles from './App.module.css';

/* ─── Intro Screen ─────────────────────────────────────── */
function IntroScreen({ onStart }) {
  return (
    <div className={styles.intro}>
      <div className={styles.introBg} aria-hidden="true">
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </div>
      <div className={styles.introContent}>
        <div className={styles.introLogo}>
          <svg width="120" height="36" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="30" fontFamily="DM Sans, sans-serif" fontWeight="700" fontSize="32" fill="#1464FF">clever</text>
          </svg>
        </div>
        <div className={styles.introTag}>SIS Sync Training</div>
        <h1 className={styles.introTitle}>
          SFTP or API?<br />
          <span className={styles.introTitleAccent}>You decide.</span>
        </h1>
        <p className={styles.introDesc}>
          Drag each statement to the correct sync type. Some behaviors belong to just one — others apply to both. See how well you know the difference.
        </p>
        <div className={styles.introCategories}>
          {CATEGORIES.map((cat, i) => (
            <span key={cat} className={styles.introCat} data-index={i}>{cat}</span>
          ))}
        </div>
        <button className={styles.startBtn} onClick={onStart}>
          Start Sorting
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p className={styles.introMeta}>{CARDS.length} cards · Immediate feedback · Retry on wrong</p>
      </div>
    </div>
  );
}

/* ─── Draggable Card ────────────────────────────────────── */
function SortCard({ card, onDragStart, shake }) {
  return (
    <div
      className={`${styles.sortCard} ${shake ? styles.shake : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, card)}
      // Touch support
      onTouchStart={(e) => {
        const touch = e.touches[0];
        e.currentTarget._touchStartX = touch.clientX;
        e.currentTarget._touchStartY = touch.clientY;
        e.currentTarget._card = card;
      }}
    >
      <span className={styles.sortCardText}>{card.text}</span>
      <div className={styles.sortCardHandle} aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="5" cy="4" r="1.5" fill="currentColor"/>
          <circle cx="11" cy="4" r="1.5" fill="currentColor"/>
          <circle cx="5" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="11" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="11" cy="12" r="1.5" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );
}

/* ─── Drop Zone ─────────────────────────────────────────── */
function DropZone({ category, onDrop, isOver, setIsOver, placedCards }) {
  const colorMap = { 'SFTP Syncs': 'sftp', 'API Syncs': 'api', 'Both': 'both' };
  const variant = colorMap[category];

  return (
    <div
      className={`${styles.dropZone} ${styles[`dropZone_${variant}`]} ${isOver ? styles.dropZoneOver : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsOver(false); onDrop(e, category); }}
    >
      <div className={styles.dropZoneHeader}>
        <span className={`${styles.dropZoneDot} ${styles[`dot_${variant}`]}`} />
        <h2 className={styles.dropZoneTitle}>{category}</h2>
        <span className={styles.dropZoneCount}>{placedCards.length}</span>
      </div>
      <div className={styles.dropZoneCards}>
        {placedCards.length === 0 && (
          <div className={styles.dropZonePlaceholder}>Drop cards here</div>
        )}
        {placedCards.map((item) => (
          <div
            key={item.card.id}
            className={`${styles.placedCard} ${item.correct ? styles.placedCorrect : styles.placedWrong}`}
          >
            <div className={styles.placedIcon}>
              {item.correct
                ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              }
            </div>
            <span className={styles.placedText}>{item.card.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Feedback Toast ────────────────────────────────────── */
function FeedbackToast({ feedback, onDismiss }) {
  if (!feedback) return null;
  return (
    <div className={`${styles.toast} ${feedback.correct ? styles.toastCorrect : styles.toastWrong}`}>
      <div className={styles.toastIcon}>
        {feedback.correct
          ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity=".15"/><path d="M5 9l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity=".15"/><path d="M6 6l6 6M12 6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        }
      </div>
      <div className={styles.toastBody}>
        <strong>{feedback.correct ? 'Correct!' : `Not quite — that's ${feedback.correct_answer}`}</strong>
        <p>{feedback.explanation}</p>
      </div>
      <button className={styles.toastClose} onClick={onDismiss} aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

/* ─── Progress Bar ──────────────────────────────────────── */
function ProgressBar({ total, placed }) {
  const pct = Math.round((placed / total) * 100);
  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.progressLabel}>{placed} / {total}</span>
    </div>
  );
}

/* ─── Completion Screen ─────────────────────────────────── */
function CompletionScreen({ results, onReview, onRestart }) {
  const correct = results.filter(r => r.correct).length;
  const total = results.length;
  return (
    <div className={styles.completion}>
      <div className={styles.completionCard}>
        <div className={styles.completionEmoji}>🎉</div>
        <h2 className={styles.completionTitle}>Activity Complete!</h2>
        <p className={styles.completionSub}>
          You placed all {total} cards correctly.
        </p>
        <p className={styles.completionNote}>
          {correct === total
            ? "Perfect run — you nailed every card on the first try!"
            : `You got ${correct} of ${total} right on the first try. Review below to reinforce the tricky ones.`
          }
        </p>
        <div className={styles.completionBtns}>
          <button className={styles.reviewBtn} onClick={onReview}>Review All Cards</button>
          <button className={styles.restartBtn} onClick={onRestart}>Sort Again</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Review Screen ─────────────────────────────────────── */
function ReviewScreen({ results, onRestart }) {
  const colorMap = { 'SFTP Syncs': 'sftp', 'API Syncs': 'api', 'Both': 'both' };
  return (
    <div className={styles.review}>
      <div className={styles.reviewHeader}>
        <button className={styles.backBtn} onClick={onRestart}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Sort Again
        </button>
        <h2 className={styles.reviewTitle}>Answer Key</h2>
        <span className={styles.reviewCount}>{results.length} cards</span>
      </div>
      <div className={styles.reviewGrid}>
        {results.map(({ card, correct }) => {
          const variant = colorMap[card.answer];
          return (
            <div key={card.id} className={`${styles.reviewCard} ${correct ? '' : styles.reviewCardMissed}`}>
              <div className={styles.reviewCardTop}>
                <span className={`${styles.reviewBadge} ${styles[`badge_${variant}`]}`}>{card.answer}</span>
                {!correct && <span className={styles.reviewMissedTag}>Missed</span>}
              </div>
              <p className={styles.reviewCardText}>{card.text}</p>
              <p className={styles.reviewCardExplanation}>{card.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Sort Screen ───────────────────────────────────────── */
function SortScreen({ onComplete }) {
  const [deck, setDeck] = useState(() => shuffle(CARDS));
  const [placed, setPlaced] = useState({ 'SFTP Syncs': [], 'API Syncs': [], 'Both': [] });
  const [feedback, setFeedback] = useState(null);
  const [dragCard, setDragCard] = useState(null);
  const [overZone, setOverZone] = useState({});
  const [shakeCard, setShakeCard] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [done, setDone] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const feedbackTimer = useRef(null);

  const currentCard = deck[0] || null;
  const totalPlaced = Object.values(placed).flat().length;

  function handleDragStart(e, card) {
    setDragCard(card);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDrop(e, category) {
    if (!dragCard) return;
    processPlacement(dragCard, category);
    setDragCard(null);
  }

  function processPlacement(card, category) {
    const correct = card.answer === category;

    if (correct) {
      // Remove from deck
      setDeck(prev => prev.filter(c => c.id !== card.id));
      setPlaced(prev => ({
        ...prev,
        [category]: [...prev[category], { card, correct: true }],
      }));
      const newResult = { card, correct: true };
      const newAllResults = [...allResults, newResult];
      setAllResults(newAllResults);
      showFeedback({ correct: true, explanation: card.explanation });

      if (newAllResults.length === CARDS.length) {
        clearTimeout(feedbackTimer.current);
        setTimeout(() => setDone(true), 800);
      }
    } else {
      // Shake the card, show wrong feedback, card stays in deck
      setShakeCard(card.id);
      setTimeout(() => setShakeCard(null), 500);
      showFeedback({ correct: false, correct_answer: card.answer, explanation: card.explanation });
    }
  }

  function showFeedback(fb) {
    clearTimeout(feedbackTimer.current);
    setFeedback(fb);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 5000);
  }

  // Allow clicking zone buttons as alternative to drag
  function handleZoneClick(category) {
    if (!currentCard) return;
    processPlacement(currentCard, category);
  }

  if (done && showReview) {
    return <ReviewScreen results={allResults} onRestart={() => window.location.reload()} />;
  }

  if (done) {
    return (
      <CompletionScreen
        results={allResults}
        onReview={() => setShowReview(true)}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return (
    <div className={styles.sortScreen}>
      <header className={styles.sortHeader}>
        <div className={styles.sortHeaderLogo}>
          <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
            <text x="0" y="20" fontFamily="DM Sans, sans-serif" fontWeight="700" fontSize="22" fill="#1464FF">clever</text>
          </svg>
        </div>
        <ProgressBar total={CARDS.length} placed={totalPlaced} />
      </header>

      <div className={styles.sortLayout}>
        {/* Card Stack */}
        <div className={styles.deckArea}>
          <p className={styles.deckLabel}>
            {currentCard ? `${deck.length} card${deck.length !== 1 ? 's' : ''} remaining` : 'All placed!'}
          </p>
          <div className={styles.deckStack}>
            {deck.slice(0, 3).reverse().map((card, i, arr) => {
              const isTop = i === arr.length - 1;
              return (
                <div key={card.id} className={styles.deckCardWrap} style={{ '--stack-i': arr.length - 1 - i }}>
                  {isTop
                    ? <SortCard card={card} onDragStart={handleDragStart} shake={shakeCard === card.id} />
                    : <div className={styles.sortCardGhost} />
                  }
                </div>
              );
            })}
            {deck.length === 0 && (
              <div className={styles.deckEmpty}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="#4ECC97" strokeWidth="2"/><path d="M12 20l6 6 10-12" stroke="#4ECC97" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>All sorted!</span>
              </div>
            )}
          </div>

          {currentCard && (
            <div className={styles.clickBtns}>
              <p className={styles.clickBtnsLabel}>Or click a category:</p>
              <div className={styles.clickBtnRow}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={styles.clickCatBtn}
                    onClick={() => handleZoneClick(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drop Zones */}
        <div className={styles.zonesArea}>
          {CATEGORIES.map(cat => (
            <DropZone
              key={cat}
              category={cat}
              onDrop={handleDrop}
              isOver={!!overZone[cat]}
              setIsOver={(v) => setOverZone(prev => ({ ...prev, [cat]: v }))}
              placedCards={placed[cat]}
            />
          ))}
        </div>
      </div>

      <FeedbackToast feedback={feedback} onDismiss={() => setFeedback(null)} />
    </div>
  );
}

/* ─── App Root ──────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState('intro');

  if (screen === 'intro') return <IntroScreen onStart={() => setScreen('sort')} />;
  if (screen === 'sort') return <SortScreen />;
  return null;
}
