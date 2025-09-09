// components/ui/visually-hidden.jsx
export function VisuallyHidden({ children, ...props }) {
    return (
      <span
        {...props}
        style={{
          border: 0,
          clip: "rect(0 0 0 0)",
          clipPath: "inset(50%)",
          height: "1px",
          width: "1px",
          margin: "-1px",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    );
  }
  