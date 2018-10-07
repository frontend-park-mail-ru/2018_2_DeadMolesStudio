import * as ViewsContext from "./ViewsContext.js";

export const showAbout = () => {
    const aboutSection = document.createElement("section");
    aboutSection.dataset.sectionName = 'about';
    aboutSection.className = "about_page";

    const aboutBlock = document.createElement("div");
    aboutBlock.className = "about__main";

    const rulesBlock = document.createElement("div");
    rulesBlock.className = "rules";

    const header = document.createElement("h2");
    header.textContent = "Как играть?";

    const rules = [
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo accusamus magni ut numquam illum dolorem eum asperiores repellat eligendi iste magnam dolore dicta optio necessitatibus veniam, laborum minus, quasi impedit! ",
        "Nisi tempora explicabo iusto nihil libero corporis ad error quam maxime doloribus ducimus possimus inventore necessitatibus temporibus tempore quidem, ea officiis quia architecto vero laboriosam, sint rem pariatur quaerat fuga? Tempora a quia nobis voluptatibus error ex, magni accusantium voluptate perferendis. Iste alias architecto harum nulla non labore rerum qui, tempore possimus id aperiam cumque ullam unde voluptate fugit odio molestiae at repudiandae minus aliquam deserunt earum maiores reiciendis. Voluptates!",
    ];


    aboutSection.appendChild(aboutBlock);
    aboutBlock.appendChild(rulesBlock);
    rulesBlock.appendChild(header);
    rules.forEach((rule) => {
        let ruleP = document.createElement('p');
        ruleP.textContent = rule;
        rulesBlock.appendChild(ruleP);
    });
    const menuButton = ViewsContext.createBackButton(rulesBlock);
    menuButton.render();

    const content = document.querySelector('.content');
    content.appendChild(aboutSection);
};