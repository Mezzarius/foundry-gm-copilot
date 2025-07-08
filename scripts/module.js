// gm-copilot.js

import { sendPromptToOpenAI } from "./api.js";

class GMCopilotApp extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "gm-copilot",
      title: "GM Copilot",
      template: "modules/foundry-gm-copilot/templates/copilot.html",
      width: 500,
      height: 400,
      resizable: true
    });
  }

  getData(options) {
    return {
      actors: game.actors.contents.filter(a => a.hasPlayerOwner === false)
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("#copilot-send").click(async () => {
      const npcId = html.find("#copilot-npc").val();
      const prompt = html.find("#copilot-prompt").val();
      const responseBox = html.find("#copilot-response");

      responseBox.text("Thinking...");

      const actor = game.actors.get(npcId);
      const npcName = actor ? actor.name : "Unknown NPC";

      try {
        const reply = await sendPromptToOpenAI(npcName, prompt);
        responseBox.text(reply);

        html.find("#copilot-send-chat").off("click").on("click", () => {
          ChatMessage.create({
            speaker: { alias: npcName },
            content: reply
          });
        });
      } catch (err) {
        console.error(err);
        responseBox.text("Error: " + err.message);
      }
    });
  }
}

// Add button to the UI
Hooks.on("ready", () => {
  game.gmCopilot = new GMCopilotApp();
  game.settings.register("foundry-gm-copilot", "openaiKey", {
    name: "OpenAI API Key",
    scope: "world",
    config: true,
    type: String,
    default: ""
  });

  // Example toggle button in the Scene Controls
  const button = document.createElement("button");
  button.innerText = "GM Copilot";
  button.classList.add("gm-copilot-button");
  button.onclick = () => game.gmCopilot.render(true);
  document.body.appendChild(button);
});
