package internal

import (
	"log"
	"strconv"
	"strings"

	"github.com/elliotchance/orderedmap"
)

type Stack struct {
	instructions []string
	jene         *JeneBuilder
	execFunc     *Function
}

func (s *Stack) InitStack(vals []string) {
	s.instructions = vals
}

func (s *Stack) ExecuteInstructions() {
	for _, instruction := range s.instructions {
		s.SplitToCommands(instruction)
	}
}

func (s *Stack) SplitToCommands(instr string) []string {
	condition := strings.Split(instr, ":")[0]
	var ret []string
	switch condition {
	case "pkg":
		ret = strings.Split(instr, ":")
		s.HandlePkgDeclaration(ret)
		break
	case "declare":
		ret = strings.Split(instr, ":")
		s.HandleVariableDeclaration(ret)
		break
	case "f-start":
		ret = strings.Split(instr, ":")
		s.HandleFunctionDeclaration(ret)
		break
	case "f-end":
		s.HandleFunctionClose()
		break
	default:
		log.Printf("Did not match any")
	}
	return ret
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

func parseVar(input string) interface{} {
	var ret interface{}
	sp := strings.Split(input, "*")
	if len(sp) <= 1 {
		log.Printf("Here %v", input)
		return input
	}

	log.Printf("SP %v %v", sp[0], sp[1])
	switch sp[0] {
	case "i":
		log.Printf("Inside int")
		temp, _ := strconv.Atoi(sp[1])
		return temp
	case "i64":
		ret, _ = strconv.ParseInt(sp[1], 10, 64)
		return ret
	case "c":
		ret, _ = strconv.ParseBool(sp[1])
		return ret
	default:
		ret = sp[1]
		return ret
	}

	return ret
}
