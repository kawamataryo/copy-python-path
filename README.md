# Copy Python Path

![](https://i.gyazo.com/4b80a051f219aab1ec8874f5475277a4.png)

<a href="https://marketplace.visualstudio.com/items?itemName=kawamataryo.copy-python-dotted-path"><img alt="installs" src="https://img.shields.io/visual-studio-marketplace/i/kawamataryo.copy-python-dotted-path?style=flat&logo=visualstudiocode"></a>
[![E2E](https://github.com/kawamataryo/copy-python-path/actions/workflows/e2e-test.yml/badge.svg)](https://github.com/kawamataryo/copy-python-path/actions/workflows/e2e-test.yml)
  
An VS Code extension to copy python dotted paths to the clipboard.
  

## Features

Would you like to get the python path, e.g. when running unittest?  
  
  
When the `copy python path` command is executed, it copies the python dotted path to the clipboard. It also works with context menus.
  
![feature](https://i.gyazo.com/fe88befdaea034eff0adfd4caacd028f.gif)

## Configuration

If you want to add the workspace folder name to the beginning of the dotted path, add the following setting to setting.json.

```
{
  "copyPythonPath.addModuleRootName": true // default false
}
```
## Notice
- This extension works only with python3 files.

## License

[MIT](https://github.com/kawamataryo/copy-python-path/blob/main/LICENSE)

## Contributing
Contributions are welcome 🎉  
We accept contributions via Pull Requests.
