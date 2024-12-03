'use client'
import { useEffect, useState } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";

/** deprecated page */
const App = () => {
  const [vd, setVd] = useState<Vditor>();
  useEffect(() => {
    const vditor = new Vditor("vditor", {
      after: () => {
        vditor.setValue("`Vditor` 最小代码示例");
        setVd(vditor);
      },
    });
    // Clear the effect
    return () => {
      vd?.destroy();
      setVd(undefined);
    };
  }, []);
  return (
    <div style={{ height:"100vh"}}>
      <div id="vditor" className="vditor" style={{ backgroundColor: '#1f2937', color: '#E5E7EB' }} />
    </div>
  );
};

export default App;
