# Copy Python Path

![](https://i.gyazo.com/4b80a051f219aab1ec8874f5475277a4.png)

<a href="https://marketplace.visualstudio.com/items?itemName=kawamataryo.copy-python-dotted-path"><img alt="installs" src="https://img.shields.io/visual-studio-marketplace/i/kawamataryo.copy-python-dotted-path?style=flat&logo=visualstudiocode"></a>
[![E2E](https://github.com/kawamataryo/copy-python-path/actions/workflows/e2e-test.yml/badge.svg)](https://github.com/kawamataryo/copy-python-path/actions/workflows/e2e-test.yml)
  
An VS Code extension to copy python dotted paths to the clipboard.
  

## Features

Would you like to get the python path, e.g. when running unittest?  
  
  
When the `copy python path` command is executed, it copies the python dotted path to the clipboard. It also works with context menus.
  
![feature](https://i.gyazo.com/fe88befdaea034eff0adfd4caacd028f.gif)

### Copying Imported Symbols

You can now also copy the full dotted path of symbols imported in your Python file. Just place your cursor on an imported symbol and run the command:

```python
from ml_service.lms.models.course_builder import CreateCourseQuizRequest

def generate_quiz_view(request: Request) -> Response:
    data = CreateCourseQuizRequest(**json.loads(request.body))  # Place cursor here and run the command
    # Will copy: ml_service.lms.models.course_builder.CreateCourseQuizRequest
```

Similarly, running the "Copy python import statement" command on an imported symbol will generate the appropriate import statement:

```
from ml_service.lms.models.course_builder import CreateCourseQuizRequest
```

## Configuration

If you want to add the workspace folder name to the beginning of the dotted path, add the following setting to setting.json.

```
{
  "copyPythonPath.addModuleRootName": true // default false
}
```

If you want to omit a specific root path from the dotted path (e.g., if your path is `root.app.folder1.classFoo` and you want to omit `root.app`), add the following setting:

```
{
  "copyPythonPath.omitRootPath": "root.app" // default empty string
}
```

## Notice
- This extension works only with python3 files.

## License

[MIT](https://github.com/kawamataryo/copy-python-path/blob/main/LICENSE)

## Contributing
Contributions are welcome 🎉  
We accept contributions via Pull Requests.
