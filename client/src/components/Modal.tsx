import { Icon } from "@iconify/react";
import { useRef } from "react";

type T_Size = "sm" | "md" | "lg";

type T_Modal = {
  title: object;
  content: object;
  footer: object;
  size: T_Size;
  state?: boolean;
  toggle?: any;
  clickOutsideClose?: boolean;
};

const selectSize = (size: T_Size) => {
  switch (size) {
    case "lg":
      return "md:w-1/2";
    case "md":
      return "md:w-2/5";
    default:
      return "md:w-1/5";
  }
};

const Modal = ({
  title,
  content,
  footer,
  size,
  state,
  toggle,
  clickOutsideClose = true,
}: T_Modal) => {
  const modalSize = selectSize(size);

  const modal = useRef(null);

  return (
    <div
      ref={modal}
      onClick={(event) => {
        clickOutsideClose && event.target === modal.current && toggle();
      }}
      className={`${
        state ? "block" : "hidden"
      } fixed top-0 left-0 bg-dark-translucent h-full w-full flex justify-center`}
    >
      <div
        className={`fixed bg-light mx-auto ${modalSize} sm:w-2/3 bg-light shadow drop-shadow-md rounded-lg border-2 border-primary self-center`}
      >
        <div className="grid">
          <div>
            <div className="px-5 pt-5 grid grid-cols-2 grid-rows-1">
              <div className="text-xl font-semibold">{title}</div>
              <div className="col-end-4 cursor-pointer" onClick={toggle}>
                <Icon icon="bi:x-lg" />
              </div>
            </div>
            <div className="px-5 pb-5 pt-5 text-sm">{content}</div>
          </div>

          <div className="flex flex-row-reverse space-x-4 space-x-reverse">
            <div className="p-5">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
