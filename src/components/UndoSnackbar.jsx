const UndoSnackbar = ({ show, onUndo }) => (
  show ? (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        background: '#23235b',
        color: '#fff',
        padding: '1rem 2rem',
        borderRadius: 10,
        boxShadow: '0 2px 12px #0002',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}
    >
      Product deleted
      <button
        onClick={onUndo}
        style={{
          background: '#fbbf24',
          color: '#23235b',
          fontWeight: 700,
          border: 'none',
          borderRadius: 6,
          padding: '0.4rem 1.2rem',
          cursor: 'pointer'
        }}
      >
        Undo
      </button>
    </div>
  ) : null
);

export default UndoSnackbar;
