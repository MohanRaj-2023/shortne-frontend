import { createContext,useContext,useState } from "react";

const PostModalContext = createContext();

export const PostModalProvider = ({children})=>{
    const [showPostModal,setShowPostModal] = useState(false);
    const openPostModal = ()=>setShowPostModal(true);
    const closePostModal = ()=>setShowPostModal(false);

    return (
        <PostModalContext.Provider value={{showPostModal,openPostModal,closePostModal}}>         
            {children}
        </PostModalContext.Provider>
    )
}

export const usePostModal = () => {
  const context = useContext(PostModalContext);
  if (context === null) {
    throw new Error('usePostModal must be used within a PostModalProvider');
  }
  return context;
};