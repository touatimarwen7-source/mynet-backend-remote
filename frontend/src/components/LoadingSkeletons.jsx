/* Loading Skeleton Components for Smooth Loading States */

export function SkeletonLoader({ width = '100%', height = '20px', count = 1, className = '' }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-line ${className}`}
          style={{
            width,
            height,
            marginBottom: '12px'
          }}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="skeleton skeleton-title" style={{ width: '70%' }} />
      <SkeletonLoader count={3} />
      <div className="skeleton skeleton-line" style={{ width: '50%' }} />
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <table style={{ width: '100%', marginBottom: '20px' }}>
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i}>
              <div className="skeleton skeleton-text" style={{ width: '80%' }} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx}>
            {Array.from({ length: columns }).map((_, colIdx) => (
              <td key={colIdx}>
                <div className="skeleton skeleton-text" style={{ width: '90%' }} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AvatarSkeleton() {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <div className="skeleton skeleton-avatar" />
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: '8px' }} />
        <div className="skeleton skeleton-text" style={{ width: '50%' }} />
      </div>
    </div>
  );
}

export function FormSkeleton({ fields = 5 }) {
  return (
    <div>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} style={{ marginBottom: '20px' }}>
          <div className="skeleton skeleton-text" style={{ width: '30%', marginBottom: '8px' }} />
          <div className="skeleton skeleton-line" style={{ height: '40px' }} />
        </div>
      ))}
      <div className="skeleton skeleton-line" style={{ height: '44px', width: '100%' }} />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div style={{ padding: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
      <div>
        <div className="skeleton skeleton-title" style={{ width: '90%', marginBottom: '20px' }} />
        <SkeletonLoader count={4} />
      </div>
      <div className="skeleton" style={{ height: '400px', borderRadius: '12px' }} />
    </div>
  );
}

export function ListSkeleton({ items = 3 }) {
  return (
    <div>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} style={{ marginBottom: '16px', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <AvatarSkeleton />
        </div>
      ))}
    </div>
  );
}
