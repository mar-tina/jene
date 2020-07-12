package internal

import (
	"bytes"
	"fmt"
	"strings"
	"text/template"

	"github.com/elliotchance/orderedmap"
)

type Function struct {
	parseString string
	templ       *template.Template
	declared    []string
	tabDepth    int
	block       bool
	prev        *Function
}

// New creates a new function with the passed in param types and returns a ref to that function
func NewFunc(name, retval string, params *orderedmap.OrderedMap) *Function {
	counter := 0
	vals := ""
	sep := ","
	for el := params.Front(); el != nil; el = el.Next() {
		if counter == params.Len()-1 {
			sep = ""
		}
		vals += fmt.Sprintf("%s %v%s", el.Key, el.Value, sep)

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
	f.declared = append(f.declared, name)
	if value == "" || value == nil {
		if f.tabDepth < 1 {
			f.tabDepth++
		}
		f.parseString += "\t"
		f.parseString += fmt.Sprintf(`var %s %v \n`, name, kind)
	} else {
		if f.tabDepth < 1 {
			f.tabDepth++
		}
		// current decl only checks for int and string values
		if _, ok := value.(int); ok {
			f.parseString += "\t"
			f.parseString += fmt.Sprintf(`%s := %v`, name, value)
			f.parseString += "\n"
		} else {
			f.parseString += "\t"
			f.parseString += fmt.Sprintf(`%s := "%s"`, name, value)
			f.parseString += "\n"
		}

	}

}

// State are the statements to be executed within function
func (f *Function) State(args ...interface{}) {
	tab := fmt.Sprintf(strings.Repeat("\t", f.tabDepth))

	for _, arg := range args {
		if f.tabDepth < 1 {
			f.tabDepth++
		}
		f.parseString += fmt.Sprintf("%v%v \n", tab, arg)
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
	var exists bool
	for _, arg := range f.declared {
		if arg == a {
			st := fmt.Sprintf("%v = %v", a, b)
			f.State(st)
			exists = true
			break
		}
	}

	if !exists {
		st := fmt.Sprintf("%v := %v", a, b)
		f.State(st)
	}
}

// LRange creates a range loop. It's declared as a method because loops
// can only be declared in a function
func (f *Function) LRange(idx, arg string, param interface{}) {
	f.block = true
	tab := fmt.Sprintf(strings.Repeat("\t", f.tabDepth))
	f.parseString += fmt.Sprintf("%vfor %v, %v := range %v {\n", tab, idx, arg, param)
	f.tabDepth++
}

// EndLRange closes the range loop
func (f *Function) EndLRange() {
	f.tabDepth--
	tab := fmt.Sprintf(strings.Repeat("\t", f.tabDepth))
	f.parseString += tab + "}\n"
	f.block = false
}

func parseParams(params *orderedmap.OrderedMap) string {
	var parseString string
	sep := ","
	counter := 0

	for el := params.Front(); el != nil; el = el.Next() {
		if counter == params.Len()-1 {
			sep = ""
		}
		switch el.Value.(type) {
		case int:
			parseString += fmt.Sprintf(`%v%s`, el.Value, sep)
		case string:
			parseString += fmt.Sprintf(`"%v"%s`, el.Value, sep)
		}

		counter++
	}

	return parseString
}

func (f *Function) Call(idx string, params *orderedmap.OrderedMap) {
	parsedParams := parseParams(params)
	parseString := fmt.Sprintf(`%s(%v)`, idx, parsedParams)
	f.State(parseString)
}

//Rcall calls the function that has a return value
func (f *Function) RCall(idx string, retvals []string, params *orderedmap.OrderedMap, defined bool) {
	parsedParams := parseParams(params)
	ret := ""
	sep := ","
	for i, arg := range retvals {
		if i == len(retvals)-1 {
			sep = ""
		}
		ret += arg + sep
	}

	if !defined {
		sep = ":"
	}
	parseString := fmt.Sprintf(`%v %s= %s(%v)`, ret, sep, idx, parsedParams)
	f.State(parseString)
}
