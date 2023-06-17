import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import storage from "@/lib/firebase";

export const onUploadToFireStorage = (
  e: React.ChangeEvent<HTMLInputElement>,
  type: "user" | "team",
  deleteFile: string[],
  handleLoadingFile: (flag: boolean) => void,
  handleSetFile: (deleteFile: string[], url: string) => void
) => {
  if (e.target.files === null) return;
  // 16文字のランダムなファイル名(キー)を生成
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let imageName = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 16; i++) {
    imageName += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  const file = e.target.files[0];
  const storageRef = ref(storage, `${type}/${imageName}`);
  const gsPath = `gs://fithub-a295f.appspot.com/${type}/${imageName}`;
  const gsRef = ref(storage, gsPath);

  // アップロード処理
  const uploadImage = uploadBytesResumable(storageRef, file);

  uploadImage.on(
    "state_changed",
    (snapshot) => {
      handleLoadingFile(true);
    },
    (err) => {
      console.log(err);
    },

    () => {
      // 画像のパスを取得
      getDownloadURL(gsRef)
        .then((url) => {
          const fileArray = [...deleteFile, url];
          return new Promise<void>((resolve) => {
            handleSetFile(fileArray, url);
            resolve();
          });
        })
        .then(() => {
          handleLoadingFile(false);
        })
        .catch((err) => console.log(err));
    }
  );
};

export const handleDeleteImage = async (
  deleteFile: string[],
  currentFile: string
) => {
  const defaultPath =
    "https://firebasestorage.googleapis.com/v0/b/fithub-a295f.appspot.com/o/default%2Fif2dmi1ea10tfgha.png?alt=media&token=6b1fa117-48f3-4858-9383-7b86e70685b0";
  deleteFile.forEach(async (file) => {
    const deleteRef = ref(storage, file);
    if (file !== defaultPath && file !== currentFile) {
      await deleteObject(deleteRef)
        .then(() => {
          console.log("削除成功");
        })
        .catch((err) => {
          console.log("削除失敗");
        });
    }
  });
};
