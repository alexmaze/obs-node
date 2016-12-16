const ffi = require('ffi')
const ref = require('ref')
const ref_arr = require('ref-array')

const types = ref.types;

const OBS_LIB_PATH = '/Users/alex/Dev/workspace/qiniu/obs-studio/build/rundir/RelWithDebInfo/bin/libobs.0';

// --------------------------------------------------------------------------------------
const lib = ffi.Library(OBS_LIB_PATH, {
  // 系统初始化
  "obs_startup": [
    types.bool, [
      types.CString,
      types.CString,
      types.CString
    ]
  ],

  // 检查系统是否初始化了
  "obs_initialized": [
    types.CString, [
      types.void
    ]
  ],

  // 获取 locale
  "obs_get_locale": [
    types.CString, [
      types.void
    ]
  ],
  
  "obs_set_locale": [
    types.void, [
      types.CString
    ]
  ],

  // 获取 profile name
  "obs_get_profiler_name_store": [
    types.CString, [
      types.void
    ]
  ],

  // 添加模块搜索路径
  "obs_add_module_path": [types.void, [types.CString, types.CString]],

  // 自动加载所有 module
  "obs_load_all_modules": [types.void, [types.void]],

  // logs loaded modules
  "obs_log_loaded_modules": [types.void, [types.void]],

  // 枚举所有源类型
  "obs_enum_source_types": [
    types.bool, [
      types.size_t, 
      types.CString
    ]
  ],
  
  // 枚举所有输入类型
  "obs_enum_input_types": [
    types.bool, [
      types.size_t, 
      types.CString
    ]
  ],

  // 枚举所有输出类型
  "obs_enum_output_types": [
    types.bool, [
      types.size_t, 
      types.CString
    ]
  ],
})

// --------------------------------------------------------------------------------------

/**
 * 启动 OBS
 */
function startup() {
  let config = ['en-US', null, null]
  const startFlag = lib.obs_startup(config[0], config[1], config[2])
  console.log('系统初始化：', startFlag)

  lib.obs_set_locale('en-US')
  lib.obs_load_all_modules(null)
  lib.obs_log_loaded_modules(null)
}



// --------------------------------------------------------------------------------------
startup();

let buf = new Buffer(16)
buf.fill(0x0)
buf.type = types.CString
for (let i = 0; lib.obs_enum_input_types(i, buf); i++) {
  console.log(i, buf.toString('ascii'))
}

// let type = new Buffer(100)
// type.type = ref.types.char
// console.log(type)
// console.log(lib.obs_enum_input_types(0, type))
// console.log(type)

// let buf = new Buffer(10)
// buf.fill(0x0)
// buf.type = types.CString
// // console.log(buf)
// for (let i = 0; lib.obs_enum_output_types(i, buf); i++) {
//   // console.log(buf)
//   console.log(buf.toString('ascii'))
// }
