import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="brand" aria-label="BioCOPPA Index — home">
      <svg className="brand__mark" viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="10" fill="#375e2d" />
        <path
          d="M24 9.5c-5 3.9-7.4 8-7.4 11.2a7.4 7.4 0 0 0 14.8 0C31.4 17.5 29 13.4 24 9.5Z"
          fill="#efcb16"
        />
        <path
          d="M24 38.5v-8.6M19.4 29.8c2.9-1.6 6.3-1.6 9.2 0"
          stroke="#efcb16"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span className="brand__text">
        <strong>BioCOPPA</strong>
        <span>Index</span>
      </span>
    </Link>
  );
}
