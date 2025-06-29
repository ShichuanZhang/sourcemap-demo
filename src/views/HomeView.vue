<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { SourceMapConsumer } from 'source-map-js'
import { onMounted, ref } from 'vue'
const js_error = ref<any>(null)
const isError = ref<boolean>(false)
const activeName = ref<string>('')
const dialogVisible = ref<boolean>(false)
const tabActiveName = ref<string>('local')

let stackFrameObj = {
  line: 0,
  column: 0,
  index: 0,
}
onMounted(() => {
  try {
    const jsErrorList = localStorage.getItem('jsErrorList')
    if (jsErrorList) {
      isError.value = true
      js_error.value = JSON.parse(jsErrorList)
    }
  } catch (e) {
    console.log(e)
  }
})

function openDialog(item: any, index: number) {
  // console.log(item, index)
  dialogVisible.value = true
  stackFrameObj = {
    line: item.lineNumber,
    column: item.columnNumber,
    index: index,
  }
}

function beforeUpload(file: any) {
  if (!file.name.endsWith('.map')) {
    ElMessage.error('请上传正确的map文件')
    return
  }
  const reader = new FileReader()
  reader.readAsText(file, 'utf-8')
  reader.onload = async (e) => {
    // console.log(reader.result)
    const code = await getSource(e.target?.result, stackFrameObj.line, stackFrameObj.column)
    js_error.value.stack_frames[stackFrameObj.index].origin = code
    dialogVisible.value = false
  }
}

async function getSource(sourcemap: any, line: number, column: number) {
  try {
    const consumer = await new SourceMapConsumer(JSON.parse(sourcemap))
    const originalPosition = consumer.originalPositionFor({
      line: line,
      column: column,
    })
    const source = consumer.sourceContentFor(originalPosition.source)
    return { source, line: originalPosition.line, column: originalPosition.column }
  } catch (e) {
    ElMessage.error('map文件解析错误' + e)
  }
}
</script>

<template>
  <div v-if="isError">
    <pre>
      {{ js_error.stack }}
    </pre>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        v-for="(item, index) in js_error.stack_frames"
        :key="index"
        :title="item.source"
        :name="index"
      >
        <el-row :gutter="20">
          <el-col :span="20">
            <div>{{ item.fileName }}</div>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="small" @click="openDialog(item, index)">
              映射源码
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <template v-if="item.origin">
            {{ item.origin }}
          </template>
          <template v-else>
            {{ item.fileName }}
          </template>
        </el-row>
      </el-collapse-item>
    </el-collapse>

    <el-dialog v-model="dialogVisible" title="Tips" width="500">
      <el-tabs v-model="tabActiveName">
        <el-tab-pane label="本地上传" name="local">
          <el-upload drag @before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div>将文件拖到此处, 或<em>点击上传</em></div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="远程加载" name="remote"></el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
