
export default function Word(props) {
  return (
    <>
      <section className="letter-section">{props.eachElement}</section>

      {/* Combined visually-hidden aria-live region for status updates */}
      <section aria-live="polite" role="status" className="sr-only">
        {props.screenReader()}
      </section>
    </>
  );
}
