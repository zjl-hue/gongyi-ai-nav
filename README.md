# 公益 AI 导航

一个面向中文用户的 AI 公益站、官方免费额度平台和开源自建工具导航页面。

## 本地预览

这是一个纯静态网站，入口在 `dist/index.html`。可以使用任意静态文件服务器预览，例如：

```powershell
python -m http.server 4173 --directory dist
```

然后打开 `http://localhost:4173/`。

## 数据维护

站点数据位于 `dist/data/sites.json`。每条记录应包含：

- 名称和直接入口；
- 分类；
- 支持模型；
- 额度或免费层说明；
- 状态；
- 来源和资料日期。

第三方站点的免费额度、模型、注册条件和可用性会变化。发布前应重新核验，并保留核验日期。不收录公共 API Key、Cookie、账号或兑换码。

## 参考

栏目结构和首批信息参考 [kirito8/free-newapi](https://github.com/kirito8/free-newapi)，该项目采用 MIT 协议。本项目重新设计页面并去除推广参数，不代表任何第三方服务。
