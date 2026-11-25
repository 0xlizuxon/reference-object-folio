# reference-object-folio

把物品参考图建成可旋转的 Three.js 物件，自动装进一个分层手风琴文件夹网页。

给 AI 助手用的 skill：你只给物品参考图，它按照片建模、装进文件夹，保留开合、封扣、折页、挂件和取放交互。

## Quick Install

**一键安装（Claude Code / Cursor / Codex / Gemini CLI）：**

```bash
npx skills add 0xlizuxon/reference-object-folio
```

**手动安装：**

```bash
git clone https://github.com/0xlizuxon/reference-object-folio.git
cp -r reference-object-folio ~/.claude/skills/
# Muse：cp -r reference-object-folio ~/workspace/custom-skills/
```

**直接发给 AI 助手安装的 Prompt（复制粘贴就能用）：**

```
请安装这个 skill：https://github.com/0xlizuxon/reference-object-folio
把它装到我的 skills 目录，装好后告诉我怎么用。
我给你一张物品参考图，你就用 reference-object-folio 把它做进分层文件夹里。
```

## 这个 skill 能做什么

- 按参考图为每件物品单独建模（同一物件的多视角合并）
- 模型按真实零件分开搭建：轮廓、倒角、装配缝、透射层、印字
- 自动装进随包提供的分层手风琴文件夹，点封面 / 封扣打开，点物件取出查看
- 取出后可拖动旋转、滚轮缩放，放回后点纸面合上
- 支持透明壳、珠光、宝石、金属扣等材质做法，见 `references/materials.md`

## 快速开始

### 1. 安装 skill

把整个仓库复制到你的 skills 目录，例如：

```bash
# Claude Code
cp -r reference-object-folio ~/.claude/skills/

# Muse / 其他支持 skills 的助手
cp -r reference-object-folio ~/workspace/custom-skills/
```

### 2. 使用

给助手一张（或多张）物品参考图，说一句：

> 用 reference-object-folio 把这件东西做进文件夹里

助手会按 `SKILL.md` 的流程建模、登记、本地验证。

### 3. 运行 demo

demo 在 `assets/archive/`，已经包含两件样品：计算器、泡罩样品。

```bash
cd assets/archive
python -m http.server 4190 --bind 127.0.0.1
# 打开 http://127.0.0.1:4190/
```

点封面打开文件夹，点物件取出，拖动旋转、滚轮缩放。

## 只替换藏品

不用改场景代码，只改 `assets/archive/collection.js`：

```js
import { makeCamera, makeCharm } from './my-objects.js';
export const collection = [
  { label: '相机', create: makeCamera, width: 1.45 },
  { label: '吊饰', create: makeCharm, width: 0.82 }
];
```

- 每个工厂函数返回一个全新的独立 `THREE.Group`，+Y 向上、+Z 是物件正面
- `width` 是文件夹局部单位，夹宽 3.4，模板自动算缩放、居中和分页面
- 参考图可放在本地项目的 `refs/` 里，在对应项加 `reference: './refs/item.jpg'`，取出后可就地对照原图

## 文件结构

```
reference-object-folio/
├── SKILL.md                  # skill 说明，给 AI 助手读
├── README.md
├── references/
│   └── materials.md          # 手柄、珠光、宝石、透明厚壁等材质做法
└── assets/
    └── archive/              # 可直接运行的 demo 项目，复制到空项目即用
        ├── index.html
        ├── three.module.js
        ├── collection.js     # 只改这里登记物件
        ├── sample-models.js  # 样品：计算器、泡罩
        ├── THREE-LICENSE.txt
        └── addons/           # Three.js 官方 addons（controls / environments / postprocessing / shaders）
```

## 许可

- 本 skill 与 demo 代码：MIT License，见仓库根目录 `LICENSE`
- Three.js 及 addons：MIT License，见 `assets/archive/THREE-LICENSE.txt`
