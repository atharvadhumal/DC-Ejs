import React from "react";
import Icons from "../../shared/icons";

const LevelBoostUI = React.memo((props: any)=> {
  return (
    <div className="level-boost-ui">
      <div className="d-flex justify-content-between">
        <div>GOAL: LVL 20</div>

        <div className="boost-txt">
          <span>0/2 Boosts</span>
          <Icons.AngleRight />
        </div>
      </div>

      <div>
        <div className="progress-bar"></div>
      </div>

    </div>
  )
})
 export default LevelBoostUI;
