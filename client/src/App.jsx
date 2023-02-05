import { useState , useEffect} from "react";
import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loader from "./assets/loader.svg";
import axios from "axios";

//let arr = [
//  {type: "user" , post: "lorem hjsdvhjsgdf"},
//  {type: "bot" , post: "lorem hjsdvhjsgdf"}
//];

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.querySelector('.layout').scrollTop = document.querySelector('.layout').scrollHeight;
  } , [posts])
  const fetchResponse = async () => {
    const data = await axios.post(
      "https://prince-gpt.onrender.com",
      { input },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  }

  const onSubmit = () => {
    if(input.trim() === "") return;
    updatePosts(input);
    updatePosts("loading..." , false , true);
    setInput("");
    fetchResponse().then((res) => {
      console.log(res);
      updatePosts(res.data.bot.trim() , true);
    })
  }

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if(index < text.length){
        setPosts(prevState => {
        let lastitem = prevState.pop();
        if(lastitem.type !== "bot"){
          prevState.push({
            type: "bot",
            post: text.charAt(index-1)
          })
        }else{
          prevState.push({
            type: "bot",
            post: lastitem.post + text.charAt(index-1)
          })
        }
        return [...prevState]
        })
        index++;
      }else{
        clearInterval(interval);
      }
    } , 10)
  }
  const updatePosts = (post , isBot , isLoading) => {
    if(isBot){
      autoTypingBotResponse(post);
    }else{
      setPosts(prevState => {
        return [
          ...prevState,
          {type: isLoading ? "loading" : "user" , post}
        ]
      })
    }
  }

  const onKeyUp = (e) => {
    if(e.key === "Enter" || e.which === 13){
      onSubmit();
    }
  }
  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {posts.map((post, index) => (
            
            <div key={index} className={`chat-bubble ${post.type === 'bot' || post.type === 'loading' ? "bot" : ""} `}>
              <div className="avatar">
                <img src={post.type === 'bot' || post.type === 'loading' ? bot : user} alt="" />
              </div>
              {
                post.type === 'loading' ? (<div className="loader">
                <img src={loader} alt="" />
              </div>) : (<div className="post">
                {post.post}
              </div>)
              }
              
              
            </div>
          ))}
        </div>
      </section>
      <footer>
        <input
        value={input}
          type="text"
          className="composebar"
          autoFocus
          placeholder="Ask your Query"
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} alt="" />
        </div>
      </footer>
    </main>
  );
}

export default App;
