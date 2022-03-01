const _constructTableActions = (
  actions: any,
  callback: any,
  isLast: boolean
) => {
  return (
    <>
      <span
        onClick={() => callback()}
        className="hover:cursor-pointer text-primary hover:underline font-bold"
      >
        {actions}
      </span>
      {!isLast ? " | " : null}
    </>
  );
};

export default _constructTableActions;
