function FormError(props: { message?: string }) {
  return (
    <p>
      {props.message ? (
        <span className="text-danger">{props.message}</span>
      ) : undefined}
    </p>
  );
}

export default FormError;
