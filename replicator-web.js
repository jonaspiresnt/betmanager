const owner = "";
const tipster = "";

const getInfoFromBetString = (betStr, key) => {
  if (key === undefined || key.length === 0) {
    return null;
  }

  const myregexp = new RegExp(`\\b${key}\\b=([^#|]+)`, "g");

  const match = myregexp.exec(betStr);

  if (match != null && match.length > 1) {
    return match[1];
  } else {
    return null;
  }
};

const button = document.createElement("button");

button.innerHTML = `${owner} - BETAR`;

const body = document.getElementsByTagName("body")[0];

body.appendChild(button);

button.addEventListener("click", async () => {
  try {
    const betStr = window.sessionStorage.getItem("betstring");

    console.log(`betStr: ${betStr}`);

    if (betStr === "bt=1") {
      alert("Caderneta vazia.");

      return;
    }

    if (!betStr.includes("st=")) {
      alert("Preencha o valor da aposta.");

      return;
    }

    const f = getInfoFromBetString(betStr, "f");
    const fp = getInfoFromBetString(betStr, "fp");
    const od = getInfoFromBetString(betStr, "o");
    const st = getInfoFromBetString(betStr, "st");
    const ln = getInfoFromBetString(betStr, "ln");

    if (f === null || fp === null || od === null || st === null) {
      console.log(`f=${f}`);
      console.log(`fp=${fp}`);
      console.log(`od=${od}`);
      console.log(`st=${st}`);
      console.log(`ln=${ln}`);

      alert("Informações da aposta não foram encontradas.");

      return;
    }

    button.innerHTML = "AGUARDE...";

    button.disabled = true;

    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      owner,
      tipster,
      eventUrl: window.location.href,
      f: parseInt(f),
      fp: parseInt(fp),
      oddFraction: od,
      stake: parseFloat(st),
      lines: ln !== null ? [ln] : undefined,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      "",
      requestOptions
    );

    if (response.status === 200) {
      const result = await response.json();

      let message = "";

      message += `Sucesso: ${result.successAccounts.length}`;

      for (let i = 0; i < result.successAccounts.length; i++) {
        const currentAccount = result.successAccounts[i];

        message += `\n`;

        message += `${currentAccount.username} (${currentAccount.owner})`;
      }

      message += `\n\n`;

      message += `Erro: ${result.errorAccounts.length}`;

      for (let i = 0; i < result.errorAccounts.length; i++) {
        const currentAccount = result.errorAccounts[i];

        message += `\n`;

        message += `${currentAccount.username} (${currentAccount.owner})`;
      }

      alert(message);
    } else if (response.status === 400) {
      const result = await response.json();

      alert(result.err);
    } else {
      alert("Verifique o status das apostas nos canais do Telegram.");
    }
  } catch (error) {
    alert(error);
  } finally {
    button.innerHTML = "BETAR";

    button.disabled = false;
  }
});

button.style.position = "fixed";
button.style.bottom = "200px";
button.style.width = "100%";
button.style.height = "50px";
button.style.background = "#136E51";
button.style.color = "#fff";
button.style.border = "none";
button.style.cursor = "pointer";
button.style.outline = "none";
