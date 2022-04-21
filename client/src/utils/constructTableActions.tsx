const _constructTableActions = (
  actions: any,
  callback: any,
  isLast: boolean,
  disabled: boolean = false
) => {
  return (
    <>
      <span
        onClick={() => (!disabled ? callback() : null)}
        className={`${
          !disabled
            ? "hover:cursor-pointer text-primary hover:underline"
            : "text-dark hover:cursor-no-drop"
        } font-bold`}
      >
        {actions}
      </span>
      {!isLast ? " | " : null}
    </>
  );
};

export default _constructTableActions;
