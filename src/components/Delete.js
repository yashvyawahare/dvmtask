import React from "react";
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';

function DelBtn(props) {

    function HandleDel(){
        props.HandleDel()
    }
    return (
        <div className="delete">
            <button onClick={HandleDel} className='addDelBtn'><BookmarkRemoveIcon className='addDelSvg'/></button>
        </div>
    )
}

export default DelBtn;
