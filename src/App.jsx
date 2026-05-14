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
            <text x="0" y="30" fontFamily="DM Sans, sans-serif" fontWeight="700" fontSize="32" fill="#1464FF">Clever</text>
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
function DropZone({ category, onDrop, isOver, setIsOver, placedCards, reviewMode, onCardClick, expandedCardId }) {
  const colorMap = { 'SFTP Syncs': 'sftp', 'API Syncs': 'api', 'Both': 'both' };
  const variant = colorMap[category];

  return (
    <div
      className={`${styles.dropZone} ${styles[`dropZone_${variant}`]} ${isOver ? styles.dropZoneOver : ''}`}
      onDragOver={(e) => { if (!reviewMode) { e.preventDefault(); setIsOver(true); } }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsOver(false); if (!reviewMode) onDrop(e, category); }}
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
          <div key={item.card.id}>
            <div
              className={`${styles.placedCard} ${item.correct ? styles.placedCorrect : styles.placedWrong} ${reviewMode ? styles.placedClickable : ''} ${expandedCardId === item.card.id ? styles.placedExpanded : ''}`}
              onClick={() => reviewMode && onCardClick(item.card.id)}
            >
              <div className={styles.placedIcon}>
                {item.correct
                  ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                }
              </div>
              <span className={styles.placedText}>{item.card.text}</span>
              {reviewMode && (
                <svg className={styles.placedChevron} style={{ transform: expandedCardId === item.card.id ? 'rotate(180deg)' : 'rotate(0deg)' }} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </div>
            {reviewMode && expandedCardId === item.card.id && (
              <div className={styles.placedExplanation}>
                {item.card.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Feedback Panel (centered, prominent) ──────────────── */
function FeedbackPanel({ feedback, onDismiss }) {
  if (!feedback) return null;
  return (
    <>
      <div className={styles.feedbackOverlay} onClick={onDismiss} />
      <div className={`${styles.feedbackPanel} ${feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong}`}>
        <div className={styles.feedbackIconRow}>
          {feedback.correct
            ? <div className={styles.feedbackIconCircle} style={{ background: 'rgba(78,204,151,0.15)' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14l5.5 5.5L22 8" stroke="#4ECC97" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            : <div className={styles.feedbackIconCircle} style={{ background: 'rgba(255,100,100,0.12)' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 8l12 12M20 8L8 20" stroke="#ff6464" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
          }
          <strong className={styles.feedbackHeading}>
            {feedback.correct ? 'Correct!' : `Not quite — that belongs in ${feedback.correct_answer}`}
          </strong>
        </div>
        <p className={styles.feedbackExplanation}>{feedback.explanation}</p>
        <button className={styles.feedbackBtn} onClick={onDismiss}>
          {feedback.correct ? 'Next Card →' : 'Try Again →'}
        </button>
      </div>
    </>
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

/* ─── Sort Screen ───────────────────────────────────────── */
function SortScreen() {
  const [deck, setDeck] = useState(() => shuffle(CARDS));
  const [placed, setPlaced] = useState({ 'SFTP Syncs': [], 'API Syncs': [], 'Both': [] });
  const [feedback, setFeedback] = useState(null);
  const [dragCard, setDragCard] = useState(null);
  const [overZone, setOverZone] = useState({});
  const [shakeCard, setShakeCard] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [done, setDone] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);
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
      setDeck(prev => prev.filter(c => c.id !== card.id));
      setPlaced(prev => ({
        ...prev,
        [category]: [...prev[category], { card, correct: true }],
      }));
      const newAllResults = [...allResults, { card, correct: true }];
      setAllResults(newAllResults);
      showFeedback({ correct: true, explanation: card.explanation });

      if (newAllResults.length === CARDS.length) {
        clearTimeout(feedbackTimer.current);
        setTimeout(() => { setFeedback(null); setDone(true); }, 600);
      }
    } else {
      setShakeCard(card.id);
      setTimeout(() => setShakeCard(null), 500);
      showFeedback({ correct: false, correct_answer: card.answer, explanation: card.explanation });
    }
  }

  function showFeedback(fb) {
    clearTimeout(feedbackTimer.current);
    setFeedback(fb);
  }

  function dismissFeedback() {
    clearTimeout(feedbackTimer.current);
    setFeedback(null);
  }

  function handleZoneClick(category) {
    if (!currentCard) return;
    processPlacement(currentCard, category);
  }

  function handleCardClick(cardId) {
    setExpandedCardId(prev => prev === cardId ? null : cardId);
  }

  return (
    <div className={styles.sortScreen}>
      <header className={styles.sortHeader}>
        <div className={styles.sortHeaderLogo}>
          <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
            <text x="0" y="20" fontFamily="DM Sans, sans-serif" fontWeight="700" fontSize="22" fill="#1464FF">Clever</text>
          </svg>
        </div>
        <ProgressBar total={CARDS.length} placed={totalPlaced} />
        {done && <span className={styles.reviewModeBadge}>Review Mode</span>}
      </header>

      {done && (
        <div className={styles.doneBar}>
          <span>🎉 All {CARDS.length} cards sorted! Click any card to see its explanation.</span>
        </div>
      )}

      <div className={styles.sortLayout}>
        {/* Card Stack — hidden in review mode */}
        {!done && (
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
        )}

        {/* Drop Zones */}
        <div className={`${styles.zonesArea} ${done ? styles.zonesAreaFull : ''}`}>
          {CATEGORIES.map(cat => (
            <DropZone
              key={cat}
              category={cat}
              onDrop={handleDrop}
              isOver={!!overZone[cat]}
              setIsOver={(v) => setOverZone(prev => ({ ...prev, [cat]: v }))}
              placedCards={placed[cat]}
              reviewMode={done}
              onCardClick={handleCardClick}
              expandedCardId={expandedCardId}
            />
          ))}
        </div>
      </div>

      <div className={styles.resourceBar}>
        <span className={styles.resourceBarLabel}>Reference docs</span>
        <div className={styles.resourceLinks}>
          <a href="https://support.clever.com/hc/s/articles/000001590?language=en_US" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            PowerSchool Plugin Sync
          </a>
          <a href="https://support.clever.com/hc/s/articles/226677767?language=en_US" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Infinite Campus API Sync
          </a>
          <a href="https://support.clever.com/hc/s/articles/205783078?language=en_US" target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            SFTP Syncs: Overview
          </a>
        </div>
      </div>

      {done && (
        <div className={styles.restartFooter}>
          <button className={styles.restartFooterBtn} onClick={() => window.location.reload()}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 1 1 1.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/><path d="M2 12V8h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Start Over
          </button>
        </div>
      )}

      <FeedbackPanel feedback={feedback} onDismiss={dismissFeedback} />
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
