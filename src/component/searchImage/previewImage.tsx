import $ from "jquery";
import { ChangeEvent } from "react";
import {getImage} from "./get_image.tsx";
import {show_search_result} from "./show_search_result.tsx"

import "./previewImage.css";

function previewImage() {
  let file: any = null;

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      file = e.target.files[0];
    }

    let reader = new FileReader();
    reader.onload = function (event) {
      $("#upload_img").attr("src", event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  function openDialog() {
    let searchDialog: any = document.getElementById("searchDialog");
    searchDialog.showModal();
  }
  function closeDialog() {
    let searchDialog: any = document.getElementById("searchDialog");
    $("#upload_img").attr("src", "");
    let upload_input: any = document.getElementById("upload_input");
    upload_input.value = null;
    let searchList: any = document.getElementById("searchList");
    searchList.innerHTML = null;
    let urlInput: any = document.getElementById("url_input");
    urlInput.value = '';
    
    searchDialog.close();
  }

  async function search() {
    let urlInput:any = document.getElementById("url_input");

    if(file != null){
      let search_data = await getImage.get_image(file);
      await show_search_result.showSearch(search_data);
    }
    else if(urlInput.value != null && urlInput.value != ''){
      let search_data = await getImage.get_image_by_text(urlInput.value);
      await show_search_result.showSearch(search_data);
      await changeImgByUrl(search_data);
    }
    else{
      alert("請上傳圖片或輸入圖片網址!!");
    }
    
  }

  async function changeImgByUrl(data:any) {
    let thumbnailUrl:string = data.results[0].header.thumbnail;
    $("#upload_img").attr("src", thumbnailUrl);
  }

  return (
    <>
      <button id="searchDialogBtn" onClick={openDialog}>
        <i className="fa-solid fa-image">圖片搜尋</i>
      </button>

      <dialog
        id="searchDialog"
        data-aos="fade-up"
      >
        <img
            id="upload_img"
            src=""
          />
        <div id='dialogArea'>          
              <form action="./uploadFiles" encType="multipart/form-data"></form>
              <div>
                <input
                  type="file"
                  id="upload_input"
                  accept="image/gif, image/jpeg, image/png"
                  onChange={uploadImage}
                />
                <div id="inputArea">
                  <p>圖片網址：</p>
                  <input
                    type="text"
                    id="url_input"
                    placeholder="輸入圖片網址"
                  />
                </div>
              </div>
            <div>
              <button 
                id="searchBtn"
                onClick={search}
              >
                搜尋
              </button>
            </div>
          </div>
          <show_search_result.searchList/>
        <i
          id="closeBtn"
          className="fa-solid fa-x"
          onClick={closeDialog}
        ></i>
      </dialog>
    </>
  );
}

export default previewImage;
