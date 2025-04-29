import React from "react";
import { useParams } from 'react-router-dom';
import Icons from "../../shared/icons";

const TextBox = React.memo((props: any) => {
  const routeParams = useParams();

  const handleOnInput = React.useCallback((e: any) => {

      if (e.currentTarget.innerText !== '') {
        document.documentElement.style.setProperty(
          '--text-box-placeholder',
          '""',
        );
      } else {
        document.documentElement.style.setProperty(
          '--text-box-placeholder',
          `"Message #${routeParams.channelId}"`,
        );
      }
      // text-box-main
    },
    [routeParams],
  );

  React.useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      '--text-box-placeholder',
      `"Message #${routeParams.channelId}"`,
    );
  }, [routeParams]);

  return (
    <div className="text-box-container">
      <div onInput={handleOnInput} className="text-box-main" contentEditable={true}>
          <div className="left-icon">
            <Icons.PlusCircle />
          </div>
          <div className="right-icons">
              <Icons.GiftBox />
              <Icons.GifIcon className='gif' />
              <Icons.SmileyFaceBox />
              <Icons.SmileyFace />
          </div>
      </div>
    </div>
  )
})

export default TextBox;
