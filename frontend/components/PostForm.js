import { Form, Input, Button } from "antd";
import react, { useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import {
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
} from "../reducers/post";
const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const [text, onChangeText, setText] = useInput("");
  useEffect(() => {
    // addPostDone이 실행되면  setText가 공백이 되게 해줌.
    if (addPostDone) {
      setText("");
    }
  }, [addPostDone]);

  const onSubmitForm = useCallback(() => {
    if (!text || !text.trim()) {
      // trim -> 문자열 좌우 공백 삭제해주는 함수.
      // text가 없으면 게시글 작성 알림띄우기
      return alert("게시글을 작성해주세요.");
    }
    const formData = new FormData(); 
     // 데이터 전송을 위해 formdata객체 생성
    imagePaths.forEach((p) => {
      formData.append("image", p);
    }); // image 파일 정보를 서버로 전달
    formData.append("content", text);
    // text 정보를 서버로 전달
    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths]);
  const imageInput = useRef();

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log("images", e.target.files); // 선택한 파일 정보
    const imageFormData = new FormData(); // 멀티파트 형식으로 서버로 전송.
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append("image", f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  });

  const onRemoveImage = useCallback((index) => () => {
    dispatch({ // 이미지 삭제
      type: REMOVE_IMAGE,
      data: index,
    });
  });
  return (
    <Form
      style={{ margin: "10px 8 20px" }}
      encType="multipart/form-data"
      onFinish={onSubmitForm}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="택시를 같이 탈 사람을 구해보세요!&#13;&#10; ex) #천안역 천안역에서 오후 1시에 택시 탈 사람 구합니다~ "
      />
      <div>
        <input
          type="file"
          multiple
          hidden
          ref={imageInput}
          name="image"
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          글쓰기
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img // // map함수 안에 데이터를 넣고 싶으면 고차함수로 만들어야함(index)
              src={`http://localhost:3065/${v}`} // 이미지 파일이 백엔드 서버에 있기 때문에 직접 백엔드 서버의 경로를 써줌.
              style={{ width: "200px" }}
              alt={v}
            />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
