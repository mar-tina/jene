# jene

A very simple experimental code gen tool

### To Run the App

Clone the REPO and run the below command

```
go run main.go

```

### Example Usage

```json
{
  "instructions": [
    "pkg:home.go:main",
    "f-start:sayHi:string:name,string salutation,string",
    "declare:email:int:i*1",
    "f-end",
    "f-start:sayBye:string:name,string salutation,string",
    "declare:friend:string:longtimefriend",
    "f-end"
  ]
}
```

Above input produces the below output in the home.go file

```go

// Code generated by go generate; DO NOT EDIT.
// This file was generated by JENE at 2020-07-12 20:24:20.153386 +0300 EAT m=+33.909365423
package main

func sayHi(name string, salutation string) string {
	email := 1
}

func sayBye(name string, salutation string) string {
	friend := "longtimefriend"
}

```

The instructions and input are separated by a ":" symbol . Endgoal is to be able to send json input to
an endpoint and receive a file with the codified response.

### Example Usage in Code

#### Declaring imports

```go

    func main() {
        jen := internal.InstantiateBuilder("trying.go", "main")

	    jen.Use("fmt")
	    jen.Use("strings")
	    // Commiting imports
	    jen.FlushUse()
    }

```

Gives you the below output

```go

    package main

    import (
        "fmt"
        "strings"
    )

```

#### Declaring a function

```go

    // Params. Function input params
    func main() {
        var vals = []string{
            "Arctic,int",
            "Southen,string",
            "Indian,int",
            "Atlantic,string",
            "Pacific,int",
        }

        params := orderedmap.NewOrderedMap()
        for _, arg := range vals {
            splitString := strings.SplitN(arg, ",", 2)
            params.Set(fmt.Sprintf("%s", splitString[0]), splitString[1])
        }
        f := internal.NewFunc("test", "int", params)
        f.Declare("book", "string", "")
        f.End()
        jen.Commit(f)
    }


```

```go
    func test(Arctic int, Southen string, Indian int, Atlantic string, Pacific int) int {
	    var book string
    }
```

#### Iterating over a variable using the range functionality

Loop Range can only be declared inside of a function

```go

    //Loop Range
    fn main() {
        f.Declare("book", "string", "Split me into little pieces")
	    f.LRange("_", "arg", `strings.Split(otherbook, " ")`)
        f.State(jen.Log("arg", "This is not fun"))
        f.EndLRange()
    }

```

```go

    otherbook := "Split me into threee"
    for _, arg := range strings.Split(otherbook, " ") {
		fmt.Printf("This is not fun %v",arg)
    }

```

#### Building a struct

```go

    //Building a struct
	rd := make(map[string]interface{})
	rd["home"] = "string"
	rd["away"] = "int"
	sbuilder := &internal.StructBuilder{}
	sbuilder.DeclareStruct("Fun", rd)
    jen.Commit(sbuilder)

```

```go

    type Fun struct {
	    home	string
	    away	int
    }

```
