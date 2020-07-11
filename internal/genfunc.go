package internal

import (
	"bytes"
	"fmt"
	"text/template"
)

type Function struct {
	parseString string
	templ       *template.Template
}

// New creates a new function with the passed in param types and returns a ref to that function
func NewFunc(name, retval string, params map[string]interface{}) *Function {
	counter := 0
	vals := ""
	for key, value := range params {
		if counter == len(params)-1 {
			vals += fmt.Sprintf("%s %v", key, value)
		} else {
			vals += fmt.Sprintf("%s %v,", key, value)
		}
		counter++
	}

	f := &Function{}
	f.parseString = fmt.Sprintf("func %v(%v) %v {\n", name, vals, retval)

	return f
}

// End of the function scope
func (f *Function) End() {
	f.parseString += fmt.Sprintf("}")
}

// Declare variables scoped to function
func (f *Function) Declare(name, kind string, value interface{}) {
	if value == "" || value == nil {
		f.parseString += fmt.Sprintf("\tvar %s %s \n", name, kind)
	} else {
		f.parseString += "\t"
		f.parseString += fmt.Sprintf(`%s := "%s"`, name, value)
		f.parseString += "\n"
	}
}

// State are the statements to be executed within function
func (f *Function) State(args ...interface{}) {
	for _, arg := range args {
		f.parseString += fmt.Sprintf("\t%v \n", arg)
	}
}

// Commit writes to file
func (f *Function) Commit(buf *bytes.Buffer) error {
	templ := template.Must(template.New("").Parse(f.parseString))
	templ.Execute(buf, nil)
	return nil
}

// StateEq sets to variables equal to each other
func (f *Function) StateEq(a, b string) {
	st := fmt.Sprintf("%v = %v", a, b)
	f.State(st)
}
