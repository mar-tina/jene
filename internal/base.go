package internal

import (
	"strconv"
	"strings"

	"github.com/elliotchance/orderedmap"
)

type Stack struct {
	instructions []string
	jene         *JeneBuilder
	execFunc     *Function
	Options      map[string]func(params []string)
	CloseOptions map[string]func()
}

func (s *Stack) InitStack(vals []string) {
	s.instructions = vals
	s.Options = make(map[string]func(params []string))
	s.CloseOptions = make(map[string]func())
	s.CreateOptions()
	s.CreateCloseOptions()
}

func (s *Stack) ExecuteInstructions() {
	for _, instruction := range s.instructions {
		s.SplitToCommands(instruction)
	}
}

func (s *Stack) SplitToCommands(instr string) {
	condition := strings.Split(instr, ":")

	if val, ok := s.CloseOptions[condition[0]]; ok {
		val()
	} else {
		f := s.CallOption(condition)
		f()
	}

}

func (s *Stack) HandlePkgDeclaration(cmd []string) {
	s.jene = InitBuilder(cmd)
}

func (s *Stack) HandleFunctionDeclaration(cmd []string) {
	params := strings.Split(cmd[3], " ")
	ord := orderedmap.NewOrderedMap()

	for _, arg := range params {
		spl := strings.Split(arg, ",")
		ord.Set(spl[0], spl[1])
	}

	s.execFunc = NewFunc(cmd[1], cmd[2], ord)
}

func (s *Stack) HandleVariableDeclaration(cmd []string) {
	s.execFunc.Declare(cmd[1], cmd[2], parseVar(cmd[3]))
}

func (s *Stack) HandleFunctionClose() {
	s.execFunc.End()
	s.jene.Commit(s.execFunc)
}

func (s *Stack) HandleStatementDeclaration(cmd []string) {
	if cmd[1] == "log" {
		s.execFunc.State(s.jene.Log(cmd[2], cmd[3]))
	} else {
		s.execFunc.State(cmd[3])
	}
}

func (s *Stack) HandleImports(cmd []string) {
	for _, arg := range strings.Split(cmd[1], ",") {
		s.jene.Use(arg)
	}

	s.jene.FlushUse()
}

func (s *Stack) HandleAssign(cmd []string) {
	s.execFunc.StateEq(cmd[1], cmd[2])
}

func (s *Stack) HandleLoopDeclaration(cmd []string) {
	s.execFunc.LRange(cmd[1], cmd[2], cmd[3])
}

func (s *Stack) HandleLoopClose() {
	s.execFunc.EndLRange()
}

func parseVar(input string) interface{} {
	var ret interface{}
	sp := strings.Split(input, "*")
	if len(sp) <= 1 {
		return input
	}

	switch sp[0] {
	case "i":
		ret, _ = strconv.Atoi(sp[1])
		break
	case "i64":
		ret, _ = strconv.ParseInt(sp[1], 10, 64)
		break
	case "c":
		ret, _ = strconv.ParseBool(sp[1])
		break
	default:
		ret = sp[1]
		break
	}

	return ret
}

func (s *Stack) CreateOptions() {
	s.Options["f-state"] = s.HandleStatementDeclaration
	s.Options["f-start"] = s.HandleFunctionDeclaration
	s.Options["l-start"] = s.HandleLoopDeclaration
	s.Options["set-to"] = s.HandleAssign
	s.Options["declare"] = s.HandleVariableDeclaration
	s.Options["imports"] = s.HandleImports
	s.Options["pkg"] = s.HandlePkgDeclaration
}

func (s *Stack) CreateCloseOptions() {
	s.CloseOptions["f-end"] = s.HandleFunctionClose
	s.CloseOptions["l-end"] = s.HandleLoopClose
}

func (s *Stack) CallOption(opt []string) func() {
	return func() {
		s.Options[opt[0]](opt)
	}
}

func (s *Stack) CallCloseOption(opt []string) func() {
	return func() {
		s.CloseOptions[opt[0]]()
	}
}
