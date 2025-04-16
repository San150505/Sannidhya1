const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDtMG9XLHZPE_9VOBhcqnkLIe5p-a2sx3o";

async function generateEmail() {
  const message = document.querySelector("#message").value;
  const tone = document.querySelector("#emotion").value;
  const language = document.querySelector("#language").value;

  const prompt = `You are an assistant that writes email replies. Generate a full, well-written email reply in ${language} with a ${tone} tone, based on the message below:\n\n"${message}"\n\nOnly return the email. Do not include explanations, options, or any extra formatting.`;

  if (!message) {
    alert("Please enter email content!");
    return;
  }
  if (!tone) {
    alert("Please select an emotion/tone!");
    return;
  }
  if (!language) {
    alert("Please select a language!");
    return;
  }

  try {
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

      const outputClass = document.getElementById("output");
      outputClass.classList.add("visible");
      outputClass.value = reply;

      const copy = document.getElementById("copy");
      copy.style.display = "block";

      outputClass.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      alert("Failed to generate reply. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while generating the reply.");
  }
}

document.getElementById("copy").addEventListener("click", () => {
  const replyText = document.getElementById("output").value;

  navigator.clipboard.writeText(replyText)
    .then(() => alert("Copied to clipboard!"))
    .catch((error) => console.error("Error copying text:", error));
});

document.getElementById("downloadBtntxt").addEventListener("click", () => {
  const content = document.getElementById("output").value;

  if (!content.trim()) {
    alert("There's no response to download!");
    return;
  }

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "email_response.txt";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

document.getElementById("downloadBtnPdf").addEventListener("click", () => {
  const content = document.getElementById("output").value;

  if (!content.trim()) {
    alert("There's no response to download!");
    return;
  }

  const blob = new Blob([content], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "email_response.pdf";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Button to open the default email client with the email content
document.getElementById("sendEmailBtn").addEventListener("click", () => {
  const emailBody = document.getElementById("output").value;

  if (!emailBody.trim()) {
    alert("No content to send. Please generate a reply first.");
    return;
  }

  const subject = encodeURIComponent("Your Email Reply");
  const body = encodeURIComponent(emailBody);

  // Opening the default email client (like Gmail) with a pre-filled subject and body
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

  // Open the email client in a new tab
  window.open(mailtoLink, '_blank');
});
