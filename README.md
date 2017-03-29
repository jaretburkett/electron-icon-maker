## electron-icon-maker

#### Global usage

Install globally using

```
npm install -g electron-icon-maker
```

To use

```
electron-icon-maker --input=/absolute/path/file.png --output=./relative/path/to/folder
```

#### Local usage

Install locally
```
npm install --save-dev electron-icon-maker
```

To use
```
./node_modules/.bin/electron-icon-maker --input=/absolute/path/file.png --output=./relative/path/to/folder
```

#### Arguments

```
--output, -o = [String] Folder to create files
--input, -i = [String] Path to PNG file
```

#### Recommendations
Input file should be 1024px x 1024px or larger. Make sure it is a 1 to 1 aspect ratio on width to height.

#### Output structure
```
[output dir]
    -[icons]
        -[mac]
            - icon.icns
        -[png]
            - 16x16.png
            - 24x24.png
            ...
            ...
            - 512x512.png
            - 1024x1024.png
        -[win]
            -icon.ico
```