## Downloading

```
git clone https://github.com/vsoika/nodejs-course.git
```

## Go to task folder  

```
cd nodejs-course/task1
```

## Installing NPM modules

```
npm install
```
**Details:**

CLI tool accepts 4 options (short alias and full name):

1.  **-s, --shift**: a shift
2.  **-i, --input**: an input file
3.  **-o, --output**: an output file
4.  **-a, --action**: an action encode/decode

## Running application example:

```bash
$ node index -a encode -s 7 -i input.txt -o output.txt
```

```bash
$ node index --action decode --shift 7 --input input.txt --output output.txt
```
