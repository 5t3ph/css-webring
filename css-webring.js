const webringUrl =
  "https://raw.githubusercontent.com/5t3ph/css-webring/main/webring.json";

export class CssWebring extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });

    const { shadowRoot } = this;

    shadowRoot.innerHTML = `
<style>
* {
  box-sizing: border-box;
}

.csswr {
text-align: var(--csswr-text-align, center);
  color: var(--csswr-text-color, #444);
  font-family: var(--csswr-font-family, -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, Ubuntu, roboto, noto, segoe ui, arial, sans-serif);
  font-size: 1rem;
}

.csswr-title {
  color: var(--csswr-title-color, #777);
  font-size: var(--csswr-title-size, 1.5rem);
  margin: 0 0 0.25em;
}

.csswr-list {
  list-style: none;
  margin: 0.5rem auto 1rem;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: var(--csswr-linkflex-justify, center);
}

.csswr-list li {
  flex: 0 1 15ch;
  padding: 0.5em;
}

.csswr-list a {
  color: var(--csswr-link-color, #0370ba);
}

.csswr-join {
  text-decoration: none;
  background-color: var(--csswr-button-bgcolor, #0370ba);
  color: var(--csswr-button-color, #fff);
  padding: 0.25em 0.5em;
  border-radius: 4px;
  display: inline-flex;
}
</style>
<aside class="csswr">
  <h2 class="csswr-title">CSS Webring</h2>
  <strong>Next up:</strong>
  <ul role="list" class="csswr-list"></ul>
  <a target="_blank" rel=”noopener noreferrer” href="https://github.com/5t3ph/css-webring" class="csswr-join">Join this Webring</a>
</aside>
    `;

    const list = shadowRoot.querySelector(".csswr-list");
    const limit = this.getAttribute("limit") ? this.getAttribute("limit") : 3;
    const current = this.getAttribute("current");
    const random = this.getAttribute("random");

    const getWebring = async () => {
      const postResp = await fetch(webringUrl);
      let webring = await postResp.json();

      if (current) {
        webring = webring.filter((link) => link.title !== current);
      }

      if (random) {
        webring = webring.sort(() => Math.random() - 0.5);
      }

      if (limit) {
        webring = webring.slice(0, limit);
      }

      return webring
        .map((item) => {
          return `<li><a href="${item.link}">${item.title}</a></li>`;
        })
        .join("");
    };

    getWebring()
      .then((webring) => {
        list.innerHTML = webring;
      })
      .catch(() => {
        list.innerHTML = `<li><em>Nothing to see here</em></li>`;
      });
  }
}

window.customElements.define("css-webring", CssWebring);