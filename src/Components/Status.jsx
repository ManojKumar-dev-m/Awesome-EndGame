import clsx from "clsx";

export default function Status(props) {
  function renderGameStatus() {
    if (props.over) {
      if (props.won) {
        return (
          <>
            <h2>You Win!</h2>
            <p>Well Done! 🎉</p>
          </>
        );
      } else {
        return (
          <>
            <h2>Game Over!</h2>
            <p>You lose! Better Start Learning Assembly 😭</p>
          </>
        );
      }
    }
    if (!props.over && props.isCorrect) {
      return <p>{props.farwell}</p>;
    } else {
      return null;
    }
  }

  return (
    <section
    aria-live="polite"
    role="status"
      className={clsx(
        "status-container",
        props.won && "won",
        props.lost && "lost",
        !props.over && props.isCorrect && "farwell",
      )}
    >
      {renderGameStatus()}
    </section>
  );
}
