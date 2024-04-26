import React from 'react';
import './index.css';

interface loadingProps {

}

const Loading: React.FC<loadingProps> = ({ }) => {

  const spans = [];
  for (let i = 1; i <= 20; i++) {
    spans.push(<span key={i} style={{ '--i': i } as any}></span>);
  }

  return (
    <div className="loading">
      {spans}
    </div>
  );
}

export default Loading;