import axios from 'axios'
import { SourceMapConsumer } from 'source-map-js'

const getSourceMap = (url: string) => {
  const res = axios.get(url)
  return res
}

export const findCodeBySourceMap = async (stackFrame: StackFrame) => {
  const sourceMap = await getSourceMap(stackFrame.fileName + '.map')
  const fileContent = sourceMap.data
  const consumer = new SourceMapConsumer(fileContent)
  const originalPosition = consumer.originalPositionFor({
    line: stackFrame.lineNumber || 0,
    column: stackFrame.columnNumber || 0,
  })

  const code = consumer.sourceContentFor(originalPosition.source)
  console.log(code)
}
