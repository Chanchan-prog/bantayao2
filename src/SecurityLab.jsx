import React, { useState } from 'react';
import { ArrowRight, Check, RotateCcw, ShieldAlert, ShieldCheck } from 'lucide-react';

const scenarios = [
  {
    sender: 'IT Help Desk <helpdesk@campus-support-login.example>',
    subject: 'Urgent: your account will be disabled today',
    preview: 'Your password expires in 30 minutes. Open the verification page and enter your credentials to keep access.',
    destination: 'campus-support-login.example/verify',
    answer: 'suspicious',
    explanation: 'The message creates urgency and asks for credentials on a lookalike domain. Open your school portal directly or contact the help desk through a known channel.',
    clues: ['Urgent deadline', 'Credential request', 'Unfamiliar domain'],
  },
  {
    sender: 'Course Coordinator <coordinator@university.example>',
    subject: 'Lab schedule for next week',
    preview: 'The updated lab schedule is posted in the course portal. You can check it after signing in through your usual bookmark.',
    destination: 'No link or attachment in this message',
    answer: 'routine',
    explanation: 'This message does not ask you to use a new link, share a password, or open an attachment. Even so, verify unexpected messages through the course portal you normally use.',
    clues: ['No credential request', 'No new destination', 'Use a known portal'],
  },
  {
    sender: 'Accounts Team <billing@university-payment.example>',
    subject: 'Invoice correction attached',
    preview: 'We found a billing error. Open the attached file and enable editing to view your refund information.',
    destination: 'Attachment: Refund_Notice.docm',
    answer: 'suspicious',
    explanation: 'An unexpected macro-enabled document and an instruction to enable editing are warning signs. Confirm billing changes through the official account portal.',
    clues: ['Unexpected attachment', 'Macro-enabled file', 'Refund pretext'],
  },
];

export default function SecurityLab() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const scenario = scenarios[index];
  const answer = answers[index];
  const finished = answers.length === scenarios.length;
  const score = answers.filter((value, position) => value === scenarios[position].answer).length;

  const choose = value => {
    if (answer) return;
    setAnswers(current => [...current, value]);
  };

  return <section id="security-lab" className="security-lab" aria-labelledby="security-lab-title">
    <div className="lab-heading"><div><p className="small-label">// INTERACTIVE SECURITY LAB / SIMULATED EXERCISE</p><h3 id="security-lab-title">Spot the warning signs</h3><p>Review each fictional message and decide how you would treat it. No links, downloads, or live systems are involved.</p></div><span className="lab-count">{String(index + 1).padStart(2, '0')} / {String(scenarios.length).padStart(2, '0')}</span></div>
    <div className="lab-grid">
      <div className="lab-message frame"><div className="lab-message-top"><span className="status-dot"/> SAMPLE INBOX MESSAGE <span>TRAINING ONLY</span></div><dl><div><dt>FROM</dt><dd>{scenario.sender}</dd></div><div><dt>SUBJECT</dt><dd>{scenario.subject}</dd></div></dl><p className="lab-message-body">{scenario.preview}</p><div className="lab-destination"><span>DESTINATION / ATTACHMENT</span><strong>{scenario.destination}</strong></div></div>
      <div className="lab-decision frame"><div className="panel-heading"><span className="small-label">// ANALYST DECISION</span><h4>What would you do?</h4></div><p className="lab-prompt">Choose your assessment before revealing the clues.</p><div className="lab-options"><button type="button" className={answer === 'suspicious' ? 'selected' : ''} onClick={() => choose('suspicious')} disabled={Boolean(answer)}><ShieldAlert size={20}/> Flag as suspicious</button><button type="button" className={answer === 'routine' ? 'selected' : ''} onClick={() => choose('routine')} disabled={Boolean(answer)}><ShieldCheck size={20}/> Treat as routine</button></div>{answer && <div className={`lab-feedback ${answer === scenario.answer ? 'correct' : 'review'}`} role="status"><strong>{answer === scenario.answer ? <><Check size={16}/> Good call</> : 'Review the clues'}</strong><p>{scenario.explanation}</p><div className="lab-clues">{scenario.clues.map(clue => <span key={clue}>{clue}</span>)}</div></div>}{answer && <div className="lab-next">{finished && <span>RESULT: {score} / {scenarios.length} CORRECT</span>}<button type="button" onClick={() => { if (finished) { setIndex(0); setAnswers([]); } else setIndex(current => current + 1); }}>{finished ? <><RotateCcw size={16}/> TRY AGAIN</> : <>NEXT MESSAGE <ArrowRight size={16}/></>}</button></div>}</div>
    </div>
  </section>;
}
