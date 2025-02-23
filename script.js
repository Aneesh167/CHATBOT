const prompt = document.querySelector("#prompt");
const chatContainer = document.querySelector(".chat-container");
const imgButton = document.querySelector("#image");
const imageInput = document.querySelector("#image input");
const img = document.querySelector("#image img");
let submit = document.querySelector("#submit");

const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDNAJTVHnql02cpgb7pmStve5lnF9haujQ";

let user = {
  message: null,
  file: {
    mime_type: null,
    data: null,
  },
};

async function generateResponse(aichatbox) {
  try {
    const requestOption = {
      method: "POST",
      headers: { "Content-Type":" application/json" },
      body: JSON.stringify(
        {
          contents: [
            {
              parts: [
                { text: user.message },
                user.file.data
                  ? {
                      inline_data: {
                        mime_type: user.file.mime_type,
                        data: user.file.data,
                      },
                    }
                  : {},
              ],
            },
          ],
        },
        (key, value) => {
          if (typeof value === "object" && value !== null) {
            return value;
          }
          return value;
        }
      ),
    };

    const response = await fetch(url, requestOption);
    const data = await response.json();

    const text = aichatbox.querySelector(".ai-chat-area");
    text.innerHTML = data.candidates[0].content.parts[0].text;

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
  } catch (error) {
    console.error(error);
  }
  finally {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
  }
}

function createChatBox(html, classes) {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

function handleChatResponse(message) {
  user.message = message;
  const html = `
    <img src="userimage.png" alt="" id="userimage" width="8%">
    <div class="user-chat-area">${user.message}
      ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" alt="User   Image" class="choosimg" />` : ""}
    </div>
  `;
  const userChatBox = createChatBox(html, "userbox");
  chatContainer.appendChild(userChatBox);

  prompt.value = "";

  const aiHtml = `
    <img src="aiimage.png" alt="" id="ai-image" width="8%">
    <div class="ai-chat-area">
      <img src="discord-typing.gif" alt="" class="load" width="50px">
    </div>
  `;
  const aichatbox = createChatBox(aiHtml, "aibox");
  chatContainer.appendChild(aichatbox);

  setTimeout(() => {
    generateResponse(aichatbox);
  }, 600);
}

prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    img.src = "img.svg";
    img.classList.remove("choose");
    handleChatResponse(prompt.value);
    user.file = {};
  }
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64string = e.target.result.split(",")[1];
    user.file = {
      mime_type: file.type,
      data: base64string,
    };
    img.src = `data:${user.file.mime_type};base64,${user.file.data}`;
    img.classList.add("choose");
  };

  reader.readAsDataURL(file);
});

imgButton.addEventListener("click", () => {
  imageInput.click();
});

submit.addEventListener("click", () => {
  img.src = "img.svg";
  img.classList.remove("choose");
  handleChatResponse(prompt.value);
  user.file = {};
});