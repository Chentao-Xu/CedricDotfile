(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
  factory(global.wasmoon = {}));
}
)(this, (function(exports) {
  'use strict';

  exports.LuaReturn = void 0;
  (function(LuaReturn) {
      LuaReturn[LuaReturn["Ok"] = 0] = "Ok";
      LuaReturn[LuaReturn["Yield"] = 1] = "Yield";
      LuaReturn[LuaReturn["ErrorRun"] = 2] = "ErrorRun";
      LuaReturn[LuaReturn["ErrorSyntax"] = 3] = "ErrorSyntax";
      LuaReturn[LuaReturn["ErrorMem"] = 4] = "ErrorMem";
      LuaReturn[LuaReturn["ErrorErr"] = 5] = "ErrorErr";
      LuaReturn[LuaReturn["ErrorFile"] = 6] = "ErrorFile";
  }
  )(exports.LuaReturn || (exports.LuaReturn = {}));
  const PointerSize = 4;
  const LUA_MULTRET = -1;
  const LUAI_MAXSTACK = 1000000;
  const LUA_REGISTRYINDEX = -LUAI_MAXSTACK - 1000;
  exports.LuaType = void 0;
  (function(LuaType) {
      LuaType[LuaType["None"] = -1] = "None";
      LuaType[LuaType["Nil"] = 0] = "Nil";
      LuaType[LuaType["Boolean"] = 1] = "Boolean";
      LuaType[LuaType["LightUserdata"] = 2] = "LightUserdata";
      LuaType[LuaType["Number"] = 3] = "Number";
      LuaType[LuaType["String"] = 4] = "String";
      LuaType[LuaType["Table"] = 5] = "Table";
      LuaType[LuaType["Function"] = 6] = "Function";
      LuaType[LuaType["Userdata"] = 7] = "Userdata";
      LuaType[LuaType["Thread"] = 8] = "Thread";
  }
  )(exports.LuaType || (exports.LuaType = {}));
  exports.LuaEventCodes = void 0;
  (function(LuaEventCodes) {
      LuaEventCodes[LuaEventCodes["Call"] = 0] = "Call";
      LuaEventCodes[LuaEventCodes["Ret"] = 1] = "Ret";
      LuaEventCodes[LuaEventCodes["Line"] = 2] = "Line";
      LuaEventCodes[LuaEventCodes["Count"] = 3] = "Count";
      LuaEventCodes[LuaEventCodes["TailCall"] = 4] = "TailCall";
  }
  )(exports.LuaEventCodes || (exports.LuaEventCodes = {}));
  exports.LuaEventMasks = void 0;
  (function(LuaEventMasks) {
      LuaEventMasks[LuaEventMasks["Call"] = 1] = "Call";
      LuaEventMasks[LuaEventMasks["Ret"] = 2] = "Ret";
      LuaEventMasks[LuaEventMasks["Line"] = 4] = "Line";
      LuaEventMasks[LuaEventMasks["Count"] = 8] = "Count";
  }
  )(exports.LuaEventMasks || (exports.LuaEventMasks = {}));
  exports.LuaLibraries = void 0;
  (function(LuaLibraries) {
      LuaLibraries["Base"] = "_G";
      LuaLibraries["Coroutine"] = "coroutine";
      LuaLibraries["Table"] = "table";
      LuaLibraries["IO"] = "io";
      LuaLibraries["OS"] = "os";
      LuaLibraries["String"] = "string";
      LuaLibraries["UTF8"] = "utf8";
      LuaLibraries["Math"] = "math";
      LuaLibraries["Debug"] = "debug";
      LuaLibraries["Package"] = "package";
  }
  )(exports.LuaLibraries || (exports.LuaLibraries = {}));
  class LuaTimeoutError extends Error {
  }

  class Decoration {
      constructor(target, options) {
          this.target = target;
          this.options = options;
      }
  }
  function decorate(target, options) {
      return new Decoration(target,options);
  }

  class Pointer extends Number {
  }

  class MultiReturn extends Array {
  }

  const INSTRUCTION_HOOK_COUNT = 1000;
  class Thread {
      constructor(lua, typeExtensions, address, parent) {
          this.closed = false;
          this.lua = lua;
          this.typeExtensions = typeExtensions;
          this.address = address;
          this.parent = parent;
      }
      newThread() {
          const address = this.lua.lua_newthread(this.address);
          if (!address) {
              throw new Error('lua_newthread returned a null pointer');
          }
          return new Thread(this.lua,this.typeExtensions,address);
      }
      resetThread() {
          this.assertOk(this.lua.lua_resetthread(this.address));
      }
      loadString(luaCode, name) {
          this.assertOk(this.lua.luaL_loadbufferx(this.address, luaCode, luaCode.length, name || luaCode, null));
      }
      loadFile(filename) {
          this.assertOk(this.lua.luaL_loadfilex(this.address, filename, null));
      }
      resume(argCount=0) {
          const dataPointer = this.lua.module._malloc(PointerSize);
          try {
              this.lua.module.setValue(dataPointer, 0, 'i32');
              const luaResult = this.lua.lua_resume(this.address, null, argCount, dataPointer);
              return {
                  result: luaResult,
                  resultCount: this.lua.module.getValue(dataPointer, 'i32'),
              };
          } finally {
              this.lua.module._free(dataPointer);
          }
      }
      getTop() {
          return this.lua.lua_gettop(this.address);
      }
      setTop(index) {
          this.lua.lua_settop(this.address, index);
      }
      remove(index) {
          return this.lua.lua_remove(this.address, index);
      }
      setField(index, name, value) {
          index = this.lua.lua_absindex(this.address, index);
          this.pushValue(value);
          this.lua.lua_setfield(this.address, index, name);
      }
      async run(argCount=0, options) {
          const originalTimeout = this.timeout;
          try {
              if ((options === null || options === void 0 ? void 0 : options.timeout) !== undefined) {
                  this.setTimeout(Date.now() + options.timeout);
              }
              let resumeResult = this.resume(argCount);
              while (resumeResult.result === exports.LuaReturn.Yield) {
                  if (this.timeout && Date.now() > this.timeout) {
                      if (resumeResult.resultCount > 0) {
                          this.pop(resumeResult.resultCount);
                      }
                      throw new LuaTimeoutError(`thread timeout exceeded`);
                  }
                  if (resumeResult.resultCount > 0) {
                      const lastValue = this.getValue(-1);
                      this.pop(resumeResult.resultCount);
                      if (lastValue === Promise.resolve(lastValue)) {
                          await lastValue;
                      } else {
                          await new Promise((resolve)=>setImmediate(resolve));
                      }
                  } else {
                      await new Promise((resolve)=>setImmediate(resolve));
                  }
                  resumeResult = this.resume(0);
              }
              this.assertOk(resumeResult.result);
              return this.getStackValues();
          } finally {
              if ((options === null || options === void 0 ? void 0 : options.timeout) !== undefined) {
                  this.setTimeout(originalTimeout);
              }
          }
      }
      runSync(argCount=0) {
          this.assertOk(this.lua.lua_pcallk(this.address, argCount, LUA_MULTRET, 0, 0, null));
          return this.getStackValues();
      }
      pop(count=1) {
          this.lua.lua_pop(this.address, count);
      }
      call(name, ...args) {
          const type = this.lua.lua_getglobal(this.address, name);
          if (type !== exports.LuaType.Function) {
              throw new Error(`A function of type '${type}' was pushed, expected is ${exports.LuaType.Function}`);
          }
          for (const arg of args) {
              this.pushValue(arg);
          }
          this.lua.lua_callk(this.address, args.length, LUA_MULTRET, 0, null);
          return this.getStackValues();
      }
      getStackValues() {
          const returns = this.getTop();
          const returnValues = new MultiReturn(returns);
          for (let i = 0; i < returns; i++) {
              returnValues[i] = this.getValue(i + 1);
          }
          return returnValues;
      }
      stateToThread(L) {
          var _a;
          return L === ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.address) ? this.parent : new Thread(this.lua,this.typeExtensions,L,this.parent || this);
      }
      pushValue(rawValue, userdata) {
          var _a;
          const decoratedValue = this.getValueDecorations(rawValue);
          const target = (_a = decoratedValue.target) !== null && _a !== void 0 ? _a : undefined;
          if (target instanceof Thread) {
              const isMain = this.lua.lua_pushthread(target.address) === 1;
              if (!isMain) {
                  this.lua.lua_xmove(target.address, this.address, 1);
              }
              return;
          }
          const startTop = this.getTop();
          switch (typeof target) {
          case 'undefined':
              this.lua.lua_pushnil(this.address);
              break;
          case 'number':
              if (Number.isInteger(target)) {
                  this.lua.lua_pushinteger(this.address, target);
              } else {
                  this.lua.lua_pushnumber(this.address, target);
              }
              break;
          case 'string':
              this.lua.lua_pushstring(this.address, target);
              break;
          case 'boolean':
              this.lua.lua_pushboolean(this.address, target ? 1 : 0);
              break;
          default:
              if (!this.typeExtensions.find((wrapper)=>wrapper.extension.pushValue(this, decoratedValue, userdata))) {
                  throw new Error(`The type '${typeof target}' is not supported by Lua`);
              }
          }
          if (decoratedValue.options.metatable) {
              this.setMetatable(decoratedValue.options.metatable, -1);
          }
          if (this.getTop() !== startTop + 1) {
              throw new Error(`pushValue expected stack size ${startTop + 1}, got ${this.getTop()}`);
          }
      }
      setMetatable(metatable, index) {
          index = this.lua.lua_absindex(this.address, index);
          if (this.lua.lua_getmetatable(this.address, index)) {
              this.pop(1);
              const name = this.getMetatableName(index);
              throw new Error(`data already has associated metatable: ${name || 'unknown name'}`);
          }
          this.pushValue(metatable);
          this.lua.lua_setmetatable(this.address, index);
      }
      getMetatableName(index) {
          const metatableNameType = this.lua.luaL_getmetafield(this.address, index, '__name');
          if (metatableNameType === exports.LuaType.Nil) {
              return undefined;
          }
          if (metatableNameType !== exports.LuaType.String) {
              this.pop(1);
              return undefined;
          }
          const name = this.lua.lua_tolstring(this.address, -1, null);
          this.pop(1);
          return name;
      }
      getValue(idx, inputType, userdata) {
          idx = this.lua.lua_absindex(this.address, idx);
          const type = inputType !== null && inputType !== void 0 ? inputType : this.lua.lua_type(this.address, idx);
          switch (type) {
          case exports.LuaType.None:
              return undefined;
          case exports.LuaType.Nil:
              return null;
          case exports.LuaType.Number:
              return this.lua.lua_tonumberx(this.address, idx, null);
          case exports.LuaType.String:
              return this.lua.lua_tolstring(this.address, idx, null);
          case exports.LuaType.Boolean:
              return Boolean(this.lua.lua_toboolean(this.address, idx));
          case exports.LuaType.Thread:
              return this.stateToThread(this.lua.lua_tothread(this.address, idx));
          default:
              {
                  let metatableName;
                  if (type === exports.LuaType.Table || type === exports.LuaType.Userdata) {
                      metatableName = this.getMetatableName(idx);
                  }
                  const typeExtensionWrapper = this.typeExtensions.find((wrapper)=>wrapper.extension.isType(this, idx, type, metatableName));
                  if (typeExtensionWrapper) {
                      return typeExtensionWrapper.extension.getValue(this, idx, userdata);
                  }
                  console.warn(`The type '${this.lua.lua_typename(this.address, type)}' returned is not supported on JS`);
                  return new Pointer(this.lua.lua_topointer(this.address, idx));
              }
          }
      }
      close() {
          if (this.isClosed()) {
              return;
          }
          if (this.hookFunctionPointer) {
              this.lua.module.removeFunction(this.hookFunctionPointer);
          }
          this.closed = true;
      }
      setTimeout(timeout) {
          if (timeout && timeout > 0) {
              if (!this.hookFunctionPointer) {
                  this.hookFunctionPointer = this.lua.module.addFunction(()=>{
                      if (Date.now() > timeout) {
                          this.pushValue(new LuaTimeoutError(`thread timeout exceeded`));
                          this.lua.lua_error(this.address);
                      }
                  }
                  , 'vii');
              }
              this.lua.lua_sethook(this.address, this.hookFunctionPointer, exports.LuaEventMasks.Count, INSTRUCTION_HOOK_COUNT);
              this.timeout = timeout;
          } else {
              this.timeout = undefined;
              this.lua.lua_sethook(this.address, null, 0, 0);
          }
      }
      getTimeout() {
          return this.timeout;
      }
      getPointer(index) {
          return new Pointer(this.lua.lua_topointer(this.address, index));
      }
      isClosed() {
          var _a;
          // console.log('aaa, isClosed', !this.address, this.closed, Boolean((_a = this.parent) === null || _a === void 0 ? void 0 : _a.isClosed()));
          return (!this.address || this.closed || Boolean((_a = this.parent) === null || _a === void 0 ? void 0 : _a.isClosed()));
      }
      indexToString(index) {
          const str = this.lua.luaL_tolstring(this.address, index, null);
          this.pop();
          return str;
      }
      dumpStack(log=console.log) {
          const top = this.getTop();
          for (let i = 1; i <= top; i++) {
              const type = this.lua.lua_type(this.address, i);
              const typename = this.lua.lua_typename(this.address, type);
              const pointer = this.getPointer(i);
              const name = this.indexToString(i);
              const value = this.getValue(i, type);
              log(i, typename, pointer, name, value);
          }
      }
      assertOk(result) {
          if (result !== exports.LuaReturn.Ok && result !== exports.LuaReturn.Yield) {
              const resultString = exports.LuaReturn[result];
              const error = new Error(`Lua Error(${resultString}/${result})`);
              if (this.getTop() > 0) {
                  if (result === exports.LuaReturn.ErrorMem) {
                      error.message = this.lua.lua_tolstring(this.address, -1, null);
                  } else {
                      const luaError = this.getValue(-1);
                      if (luaError instanceof Error) {
                          error.stack = luaError.stack;
                      }
                      error.message = this.indexToString(-1);
                  }
              }
              if (result !== exports.LuaReturn.ErrorMem) {
                  try {
                      this.lua.luaL_traceback(this.address, this.address, null, 1);
                      const traceback = this.lua.lua_tolstring(this.address, -1, null);
                      if (traceback.trim() !== 'stack traceback:') {
                          error.message = `${error.message}\n${traceback}`;
                      }
                      this.pop(1);
                  } catch (err) {
                      console.warn('Failed to generate stack trace', err);
                  }
              }
              throw error;
          }
      }
      getValueDecorations(value) {
          return value instanceof Decoration ? value : new Decoration(value,{});
      }
  }

  class Global extends Thread {
      constructor(cmodule, shouldTraceAllocations) {
          if (shouldTraceAllocations) {
              const memoryStats = {
                  memoryUsed: 0
              };
              const allocatorFunctionPointer = cmodule.module.addFunction((_userData,pointer,oldSize,newSize)=>{
                  if (newSize === 0) {
                      if (pointer) {
                          memoryStats.memoryUsed -= oldSize;
                          cmodule.module._free(pointer);
                      }
                      return 0;
                  }
                  const endMemoryDelta = pointer ? newSize - oldSize : newSize;
                  const endMemory = memoryStats.memoryUsed + endMemoryDelta;
                  if (newSize > oldSize && memoryStats.memoryMax && endMemory > memoryStats.memoryMax) {
                      return 0;
                  }
                  const reallocated = cmodule.module._realloc(pointer, newSize);
                  if (reallocated) {
                      memoryStats.memoryUsed = endMemory;
                  }
                  return reallocated;
              }
              , 'iiiii');
              super(cmodule, [], cmodule.lua_newstate(allocatorFunctionPointer, null));
              this.memoryStats = memoryStats;
              this.allocatorFunctionPointer = allocatorFunctionPointer;
          } else {
              super(cmodule, [], cmodule.luaL_newstate());
          }
          if (this.isClosed()) {
              throw new Error('Global state could not be created (probably due to lack of memory)');
          }
      }
      close() {
          if (this.isClosed()) {
              return;
          }
          super.close();
          this.lua.lua_close(this.address);
          if (this.allocatorFunctionPointer) {
              this.lua.module.removeFunction(this.allocatorFunctionPointer);
          }
          for (const wrapper of this.typeExtensions) {
              wrapper.extension.close();
          }
      }
      registerTypeExtension(priority, extension) {
          this.typeExtensions.push({
              extension,
              priority
          });
          this.typeExtensions.sort((a,b)=>b.priority - a.priority);
      }
      loadLibrary(library) {
          switch (library) {
          case exports.LuaLibraries.Base:
              this.lua.luaopen_base(this.address);
              break;
          case exports.LuaLibraries.Coroutine:
              this.lua.luaopen_coroutine(this.address);
              break;
          case exports.LuaLibraries.Table:
              this.lua.luaopen_table(this.address);
              break;
          case exports.LuaLibraries.IO:
              this.lua.luaopen_io(this.address);
              break;
          case exports.LuaLibraries.OS:
              this.lua.luaopen_os(this.address);
              break;
          case exports.LuaLibraries.String:
              this.lua.luaopen_string(this.address);
              break;
          case exports.LuaLibraries.UTF8:
              this.lua.luaopen_string(this.address);
              break;
          case exports.LuaLibraries.Math:
              this.lua.luaopen_math(this.address);
              break;
          case exports.LuaLibraries.Debug:
              this.lua.luaopen_debug(this.address);
              break;
          case exports.LuaLibraries.Package:
              this.lua.luaopen_package(this.address);
              break;
          }
          this.lua.lua_setglobal(this.address, library);
      }
      get(name) {
          const type = this.lua.lua_getglobal(this.address, name);
          const value = this.getValue(-1, type);
          this.pop();
          return value;
      }
      set(name, value) {
          this.pushValue(value);
          this.lua.lua_setglobal(this.address, name);
      }
      getTable(name, callback) {
          const startStackTop = this.getTop();
          const type = this.lua.lua_getglobal(this.address, name);
          try {
              if (type !== exports.LuaType.Table) {
                  throw new TypeError(`Unexpected type in ${name}. Expected ${exports.LuaType[exports.LuaType.Table]}. Got ${exports.LuaType[type]}.`);
              }
              callback(startStackTop + 1);
          } finally {
              if (this.getTop() !== startStackTop + 1) {
                  console.warn(`getTable: expected stack size ${startStackTop} got ${this.getTop()}`);
              }
              this.setTop(startStackTop);
          }
      }
      getMemoryUsed() {
          return this.getMemoryStatsRef().memoryUsed;
      }
      getMemoryMax() {
          return this.getMemoryStatsRef().memoryMax;
      }
      setMemoryMax(max) {
          this.getMemoryStatsRef().memoryMax = max;
      }
      getMemoryStatsRef() {
          if (!this.memoryStats) {
              throw new Error('Memory allocations is not being traced, please build engine with { traceAllocations: true }');
          }
          return this.memoryStats;
      }
  }

  class LuaTypeExtension {
      constructor(thread, name) {
          this.thread = thread;
          this.name = name;
      }
      isType(_thread, _index, type, name) {
          return type === exports.LuaType.Userdata && name === this.name;
      }
      getValue(thread, index, _userdata) {
          const refUserdata = thread.lua.luaL_testudata(thread.address, index, this.name);
          if (!refUserdata) {
              throw new Error(`data does not have the expected metatable: ${this.name}`);
          }
          const referencePointer = thread.lua.module.getValue(refUserdata, '*');
          return thread.lua.getRef(referencePointer);
      }
      pushValue(thread, decoratedValue, _userdata) {
          const {target} = decoratedValue;
          const pointer = thread.lua.ref(target);
          const userDataPointer = thread.lua.lua_newuserdatauv(thread.address, PointerSize, 0);
          thread.lua.module.setValue(userDataPointer, pointer, '*');
          if (exports.LuaType.Nil === thread.lua.luaL_getmetatable(thread.address, this.name)) {
              thread.pop(2);
              throw new Error(`metatable not found: ${this.name}`);
          }
          thread.lua.lua_setmetatable(thread.address, -2);
          return true;
      }
  }

  class ErrorTypeExtension extends LuaTypeExtension {
      constructor(thread, injectObject) {
          super(thread, 'js_error');
          this.gcPointer = thread.lua.module.addFunction((functionStateAddress)=>{
              const userDataPointer = thread.lua.luaL_checkudata(functionStateAddress, 1, this.name);
              const referencePointer = thread.lua.module.getValue(userDataPointer, '*');
              thread.lua.unref(referencePointer);
              return exports.LuaReturn.Ok;
          }
          , 'ii');
          if (thread.lua.luaL_newmetatable(thread.address, this.name)) {
              const metatableIndex = thread.lua.lua_gettop(thread.address);
              thread.lua.lua_pushstring(thread.address, 'protected metatable');
              thread.lua.lua_setfield(thread.address, metatableIndex, '__metatable');
              thread.lua.lua_pushcclosure(thread.address, this.gcPointer, 0);
              thread.lua.lua_setfield(thread.address, metatableIndex, '__gc');
              thread.pushValue((jsRefError,key)=>{
                  if (key === 'message') {
                      return jsRefError.message;
                  }
                  return null;
              }
              );
              thread.lua.lua_setfield(thread.address, metatableIndex, '__index');
              thread.pushValue((jsRefError)=>{
                  return jsRefError.message;
              }
              );
              thread.lua.lua_setfield(thread.address, metatableIndex, '__tostring');
          }
          thread.lua.lua_pop(thread.address, 1);
          if (injectObject) {
              thread.set('Error', {
                  create: (message)=>{
                      if (message && typeof message !== 'string') {
                          throw new Error('message must be a string');
                      }
                      return new Error(message);
                  }
                  ,
              });
          }
      }
      pushValue(thread, decoration) {
          if (!(decoration.target instanceof Error)) {
              return false;
          }
          return super.pushValue(thread, decoration);
      }
      close() {
          this.thread.lua.module.removeFunction(this.gcPointer);
      }
  }
  function createTypeExtension$5(thread, injectObject) {
      return new ErrorTypeExtension(thread,injectObject);
  }

  class RawResult {
      constructor(count) {
          this.count = count;
      }
  }

  function decorateFunction(target, options) {
      return new Decoration(target,options);
  }
  class FunctionTypeExtension extends LuaTypeExtension {
      constructor(thread) {
          super(thread, 'js_function');
          this.functionRegistry = typeof FinalizationRegistry !== 'undefined' ? new FinalizationRegistry((func)=>{
              if (!this.thread.isClosed()) {
                  this.thread.lua.luaL_unref(this.thread.address, LUA_REGISTRYINDEX, func);
              }
          }
          ) : undefined;
          if (!this.functionRegistry) {
              console.warn('FunctionTypeExtension: FinalizationRegistry not found. Memory leaks likely.');
          }
          this.gcPointer = thread.lua.module.addFunction((calledL)=>{
              thread.lua.luaL_checkudata(calledL, 1, this.name);
              const userDataPointer = thread.lua.luaL_checkudata(calledL, 1, this.name);
              const referencePointer = thread.lua.module.getValue(userDataPointer, '*');
              thread.lua.unref(referencePointer);
              return exports.LuaReturn.Ok;
          }
          , 'ii');
          if (thread.lua.luaL_newmetatable(thread.address, this.name)) {
              thread.lua.lua_pushstring(thread.address, '__gc');
              thread.lua.lua_pushcclosure(thread.address, this.gcPointer, 0);
              thread.lua.lua_settable(thread.address, -3);
              thread.lua.lua_pushstring(thread.address, '__metatable');
              thread.lua.lua_pushstring(thread.address, 'protected metatable');
              thread.lua.lua_settable(thread.address, -3);
          }
          thread.lua.lua_pop(thread.address, 1);
          this.functionWrapper = thread.lua.module.addFunction((calledL)=>{
              const calledThread = thread.stateToThread(calledL);
              const refUserdata = thread.lua.luaL_checkudata(calledL, thread.lua.lua_upvalueindex(1), this.name);
              const refPointer = thread.lua.module.getValue(refUserdata, '*');
              const {target, options} = thread.lua.getRef(refPointer);
              const argsQuantity = calledThread.getTop();
              const args = [];
              if (options.receiveThread) {
                  args.push(calledThread);
              }
              if (options.receiveArgsQuantity) {
                  args.push(argsQuantity);
              } else {
                  for (let i = 1; i <= argsQuantity; i++) {
                      const value = calledThread.getValue(i);
                      if (i !== 1 || !(options === null || options === void 0 ? void 0 : options.self) || value !== options.self) {
                          args.push(value);
                      }
                  }
              }
              try {
                  const result = target.apply(options === null || options === void 0 ? void 0 : options.self, args);
                  if (result === undefined) {
                      return 0;
                  } else if (result instanceof RawResult) {
                      return result.count;
                  } else if (result instanceof MultiReturn) {
                      for (const item of result) {
                          calledThread.pushValue(item);
                      }
                      return result.length;
                  } else {
                      calledThread.pushValue(result);
                      return 1;
                  }
              } catch (err) {
                  if (err === Infinity) {
                      throw err;
                  }
                  calledThread.pushValue(err);
                  return calledThread.lua.lua_error(calledThread.address);
              }
          }
          , 'ii');
      }
      close() {
          this.thread.lua.module.removeFunction(this.gcPointer);
          this.thread.lua.module.removeFunction(this.functionWrapper);
      }
      isType(_thread, _index, type) {
          return type === exports.LuaType.Function;
      }
      pushValue(thread, decoration) {
          if (typeof decoration.target !== 'function') {
              return false;
          }
          const pointer = thread.lua.ref(decoration);
          const userDataPointer = thread.lua.lua_newuserdatauv(thread.address, PointerSize, 0);
          thread.lua.module.setValue(userDataPointer, pointer, '*');
          if (exports.LuaType.Nil === thread.lua.luaL_getmetatable(thread.address, this.name)) {
              thread.pop(1);
              thread.lua.unref(pointer);
              throw new Error(`metatable not found: ${this.name}`);
          }
          thread.lua.lua_setmetatable(thread.address, -2);
          thread.lua.lua_pushcclosure(thread.address, this.functionWrapper, 1);
          return true;
      }
      getValue(thread, index) {
          var _a;
          thread.lua.lua_pushvalue(thread.address, index);
          const func = thread.lua.luaL_ref(thread.address, LUA_REGISTRYINDEX);
          const jsFunc = (...args)=>{
              if (thread.isClosed()) {
                  console.warn('Tried to call a function after closing lua state');
                  return;
              }
              const internalType = thread.lua.lua_rawgeti(thread.address, LUA_REGISTRYINDEX, func);
              if (internalType !== exports.LuaType.Function) {
                  throw new Error(`A function of type '${internalType}' was pushed, expected is ${exports.LuaType.Function}`);
              }
              for (const arg of args) {
                  thread.pushValue(arg);
              }
              const status = thread.lua.lua_pcallk(thread.address, args.length, 1, 0, 0, null);
              if (status === exports.LuaReturn.Yield) {
                  throw new Error('cannot yield in callbacks from javascript');
              }
              thread.assertOk(status);
              const result = thread.getValue(-1);
              thread.pop();
              return result;
          }
          ;
          (_a = this.functionRegistry) === null || _a === void 0 ? void 0 : _a.register(jsFunc, func);
          return jsFunc;
      }
  }
  function createTypeExtension$4(thread) {
      return new FunctionTypeExtension(thread);
  }

  class PromiseTypeExtension extends LuaTypeExtension {
      constructor(thread, injectObject) {
          super(thread, 'js_promise');
          this.functionRegistry = typeof FinalizationRegistry !== 'undefined' ? new FinalizationRegistry((func)=>{
              this.thread.lua.module.removeFunction(func);
          }
          ) : undefined;
          if (!this.functionRegistry) {
              console.warn('PromiseTypeExtension: FinalizationRegistry not found. Memory leaks likely.');
          }
          this.gcPointer = thread.lua.module.addFunction((functionStateAddress)=>{
              const userDataPointer = thread.lua.luaL_checkudata(functionStateAddress, 1, this.name);
              const referencePointer = thread.lua.module.getValue(userDataPointer, '*');
              thread.lua.unref(referencePointer);
              return exports.LuaReturn.Ok;
          }
          , 'ii');
          if (thread.lua.luaL_newmetatable(thread.address, this.name)) {
              const metatableIndex = thread.lua.lua_gettop(thread.address);
              thread.lua.lua_pushstring(thread.address, 'protected metatable');
              thread.lua.lua_setfield(thread.address, metatableIndex, '__metatable');
              thread.lua.lua_pushcclosure(thread.address, this.gcPointer, 0);
              thread.lua.lua_setfield(thread.address, metatableIndex, '__gc');
              const checkSelf = (self)=>{
                  if (Promise.resolve(self) !== self) {
                      throw new Error('promise method called without self instance');
                  }
                  return true;
              }
              ;
              thread.pushValue({
                  next: (self,...args)=>checkSelf(self) && self.then(...args),
                  catch: (self,...args)=>checkSelf(self) && self.catch(...args),
                  finally: (self,...args)=>checkSelf(self) && self.finally(...args),
                  await: decorateFunction((functionThread,self)=>{
                      var _a;
                      checkSelf(self);
                      let promiseResult = undefined;
                      const awaitPromise = self.then((res)=>{
                          promiseResult = {
                              status: 'fulfilled',
                              value: res
                          };
                      }
                      ).catch((err)=>{
                          promiseResult = {
                              status: 'rejected',
                              value: err
                          };
                      }
                      );
                      const continuance = this.thread.lua.module.addFunction((continuanceState)=>{
                          if (!promiseResult) {
                              return thread.lua.lua_yieldk(functionThread.address, 0, 0, continuance);
                          }
                          const continuanceThread = thread.stateToThread(continuanceState);
                          if (promiseResult.status === 'rejected') {
                              continuanceThread.pushValue(promiseResult.value || new Error('promise rejected with no error'));
                              return this.thread.lua.lua_error(continuanceState);
                          }
                          if (promiseResult.value instanceof RawResult) {
                              return promiseResult.value.count;
                          } else if (promiseResult.value instanceof MultiReturn) {
                              for (const arg of promiseResult.value) {
                                  continuanceThread.pushValue(arg);
                              }
                              return promiseResult.value.length;
                          } else {
                              continuanceThread.pushValue(promiseResult.value);
                              return 1;
                          }
                      }
                      , 'iiii');
                      (_a = this.functionRegistry) === null || _a === void 0 ? void 0 : _a.register(awaitPromise, continuance);
                      functionThread.pushValue(awaitPromise);
                      return new RawResult(thread.lua.lua_yieldk(functionThread.address, 1, 0, continuance));
                  }
                  , {
                      receiveThread: true
                  }),
              });
              thread.lua.lua_setfield(thread.address, metatableIndex, '__index');
              thread.pushValue((self,other)=>self === other);
              thread.lua.lua_setfield(thread.address, metatableIndex, '__eq');
          }
          thread.lua.lua_pop(thread.address, 1);
          if (injectObject) {
              thread.set('Promise', {
                  create: (callback)=>new Promise(callback),
                  all: (promiseArray)=>{
                      if (!Array.isArray(promiseArray)) {
                          throw new Error('argument must be an array of promises');
                      }
                      return Promise.all(promiseArray.map((potentialPromise)=>Promise.resolve(potentialPromise)));
                  }
                  ,
                  resolve: (value)=>Promise.resolve(value),
              });
          }
      }
      close() {
          this.thread.lua.module.removeFunction(this.gcPointer);
      }
      pushValue(thread, decoration) {
          if (Promise.resolve(decoration.target) !== decoration.target) {
              return false;
          }
          return super.pushValue(thread, decoration);
      }
  }
  function createTypeExtension$3(thread, injectObject) {
      return new PromiseTypeExtension(thread,injectObject);
  }

  function decorateProxy(target, options) {
      return new Decoration(target,options || {});
  }
  class ProxyTypeExtension extends LuaTypeExtension {
      constructor(thread) {
          super(thread, 'js_proxy');
          this.gcPointer = thread.lua.module.addFunction((functionStateAddress)=>{
              const userDataPointer = thread.lua.luaL_checkudata(functionStateAddress, 1, this.name);
              const referencePointer = thread.lua.module.getValue(userDataPointer, '*');
              thread.lua.unref(referencePointer);
              return exports.LuaReturn.Ok;
          }
          , 'ii');
          if (thread.lua.luaL_newmetatable(thread.address, this.name)) {
              const metatableIndex = thread.lua.lua_gettop(thread.address);
              thread.lua.lua_pushstring(thread.address, 'protected metatable');
              thread.lua.lua_setfield(thread.address, metatableIndex, '__metatable');
              thread.lua.lua_pushcclosure(thread.address, this.gcPointer, 0);
              thread.lua.lua_setfield(thread.address, metatableIndex, '__gc');
              thread.pushValue((self,key)=>{
                  switch (typeof key) {
                  case 'number':
                      key = key - 1;
                  case 'string':
                      break;
                  default:
                      throw new Error('Only strings or numbers can index js objects');
                  }
                  const value = self[key];
                  if (typeof value === 'function') {
                      return decorateFunction(value, {
                          self
                      });
                  }
                  return value;
              }
              );
              thread.lua.lua_setfield(thread.address, metatableIndex, '__index');
              thread.pushValue((self,key,value)=>{
                  switch (typeof key) {
                  case 'number':
                      key = key - 1;
                  case 'string':
                      break;
                  default:
                      throw new Error('Only strings or numbers can index js objects');
                  }
                  self[key] = value;
              }
              );
              thread.lua.lua_setfield(thread.address, metatableIndex, '__newindex');
              thread.pushValue((self)=>{
                  var _a, _b;
                  return (_b = (_a = self.toString) === null || _a === void 0 ? void 0 : _a.call(self)) !== null && _b !== void 0 ? _b : typeof self;
              }
              );
              thread.lua.lua_setfield(thread.address, metatableIndex, '__tostring');
              thread.pushValue((self)=>{
                  return self.length || 0;
              }
              );
              thread.lua.lua_setfield(thread.address, metatableIndex, '__len');
              thread.pushValue((self)=>{
                  const keys = Object.getOwnPropertyNames(self);
                  let i = 0;
                  return MultiReturn.of(()=>{
                      const ret = MultiReturn.of(keys[i], self[keys[i]]);
                      i++;
                      return ret;
                  }
                  , self, null);
              }
              );
              thread.lua.lua_setfield(thread.address, metatableIndex, '__pairs');
              thread.pushValue((self,other)=>{
                  return self === other;
              }
              );
              thread.lua.lua_setfield(thread.address, metatableIndex, '__eq');
              thread.pushValue((self,...args)=>{
                  if (args[0] === self) {
                      args.shift();
                  }
                  return self(...args);
              }
              );
              thread.lua.lua_setfield(thread.address, metatableIndex, '__call');
          }
          thread.lua.lua_pop(thread.address, 1);
      }
      isType(_thread, _index, type, name) {
          return type === exports.LuaType.Userdata && name === this.name;
      }
      getValue(thread, index) {
          const refUserdata = thread.lua.lua_touserdata(thread.address, index);
          const referencePointer = thread.lua.module.getValue(refUserdata, '*');
          return thread.lua.getRef(referencePointer);
      }
      pushValue(thread, decoratedValue) {
          var _a;
          const {target, options} = decoratedValue;
          if (options.proxy === undefined) {
              if (target === null || target === undefined) {
                  return false;
              }
              if (typeof target !== 'object') {
                  const isClass = typeof target === 'function' && ((_a = target.prototype) === null || _a === void 0 ? void 0 : _a.constructor) === target && target.toString().startsWith('class ');
                  if (!isClass) {
                      return false;
                  }
              }
              if (Promise.resolve(target) === target) {
                  return false;
              }
          } else if (options.proxy === false) {
              return false;
          }
          if (options.metatable && !(options.metatable instanceof Decoration)) {
              decoratedValue.options.metatable = decorateProxy(options.metatable, {
                  proxy: false
              });
              return false;
          }
          return super.pushValue(thread, decoratedValue);
      }
      close() {
          this.thread.lua.module.removeFunction(this.gcPointer);
      }
  }
  function createTypeExtension$2(thread) {
      return new ProxyTypeExtension(thread);
  }

  class TableTypeExtension extends LuaTypeExtension {
      constructor(thread) {
          super(thread, 'js_table');
      }
      close() {}
      isType(_thread, _index, type) {
          return type === exports.LuaType.Table;
      }
      getValue(thread, index, userdata) {
          const seenMap = userdata || new Map();
          const pointer = thread.lua.lua_topointer(thread.address, index);
          let table = seenMap.get(pointer);
          if (!table) {
              table = {};
              seenMap.set(pointer, table);
              this.tableToObject(thread, index, seenMap, table);
          }
          const keys = Object.keys(table);
          const isSequential = keys.length > 0 && keys.every((key,index)=>key === String(index + 1));
          return isSequential ? Object.values(table) : table;
      }
      pushValue(thread, {target}, userdata) {
          if (typeof target !== 'object' || target === null) {
              return false;
          }
          const seenMap = userdata || new Map();
          const existingReference = seenMap.get(target);
          if (existingReference !== undefined) {
              thread.lua.lua_rawgeti(thread.address, LUA_REGISTRYINDEX, existingReference);
              return true;
          }
          try {
              const tableIndex = thread.getTop() + 1;
              const createTable = (arrayCount,keyCount)=>{
                  thread.lua.lua_createtable(thread.address, arrayCount, keyCount);
                  const ref = thread.lua.luaL_ref(thread.address, LUA_REGISTRYINDEX);
                  seenMap.set(target, ref);
                  thread.lua.lua_rawgeti(thread.address, LUA_REGISTRYINDEX, ref);
              }
              ;
              if (Array.isArray(target)) {
                  createTable(target.length, 0);
                  for (let i = 0; i < target.length; i++) {
                      thread.pushValue(i + 1, seenMap);
                      thread.pushValue(target[i], seenMap);
                      thread.lua.lua_settable(thread.address, tableIndex);
                  }
              } else {
                  createTable(0, Object.getOwnPropertyNames(target).length);
                  for (const key in target) {
                      thread.pushValue(key, seenMap);
                      thread.pushValue(target[key], seenMap);
                      thread.lua.lua_settable(thread.address, tableIndex);
                  }
              }
          } finally {
              if (userdata === undefined) {
                  for (const reference of seenMap.values()) {
                      thread.lua.luaL_unref(thread.address, LUA_REGISTRYINDEX, reference);
                  }
              }
          }
          return true;
      }
      tableToObject(thread, index, seenMap, table) {
          thread.lua.lua_pushnil(thread.address);
          while (thread.lua.lua_next(thread.address, index)) {
              const key = thread.lua.luaL_tolstring(thread.address, -2, null);
              thread.pop();
              const value = thread.getValue(-1, undefined, seenMap);
              table[key] = value;
              thread.pop();
          }
      }
  }
  function createTypeExtension$1(thread) {
      return new TableTypeExtension(thread);
  }

  function decorateUserdata(target) {
      return new Decoration(target,{
          reference: true
      });
  }
  class UserdataTypeExtension extends LuaTypeExtension {
      constructor(thread) {
          super(thread, 'js_userdata');
          this.gcPointer = thread.lua.module.addFunction((functionStateAddress)=>{
              const userDataPointer = thread.lua.luaL_checkudata(functionStateAddress, 1, this.name);
              const referencePointer = thread.lua.module.getValue(userDataPointer, '*');
              thread.lua.unref(referencePointer);
              return exports.LuaReturn.Ok;
          }
          , 'ii');
          if (thread.lua.luaL_newmetatable(thread.address, this.name)) {
              const metatableIndex = thread.lua.lua_gettop(thread.address);
              thread.lua.lua_pushstring(thread.address, 'protected metatable');
              thread.lua.lua_setfield(thread.address, metatableIndex, '__metatable');
              thread.lua.lua_pushcclosure(thread.address, this.gcPointer, 0);
              thread.lua.lua_setfield(thread.address, metatableIndex, '__gc');
          }
          thread.lua.lua_pop(thread.address, 1);
      }
      isType(_thread, _index, type, name) {
          return type === exports.LuaType.Userdata && name === this.name;
      }
      getValue(thread, index) {
          const refUserdata = thread.lua.lua_touserdata(thread.address, index);
          const referencePointer = thread.lua.module.getValue(refUserdata, '*');
          return thread.lua.getRef(referencePointer);
      }
      pushValue(thread, decoratedValue) {
          if (!decoratedValue.options.reference) {
              return false;
          }
          return super.pushValue(thread, decoratedValue);
      }
      close() {
          this.thread.lua.module.removeFunction(this.gcPointer);
      }
  }
  function createTypeExtension(thread) {
      return new UserdataTypeExtension(thread);
  }

  class LuaEngine {
      constructor(cmodule, {openStandardLibs=true, injectObjects=false, enableProxy=true, traceAllocations=false}={}) {
          this.cmodule = cmodule;
          this.global = new Global(this.cmodule,traceAllocations);
          this.global.registerTypeExtension(0, createTypeExtension$1(this.global));
          this.global.registerTypeExtension(0, createTypeExtension$4(this.global));
          this.global.registerTypeExtension(1, createTypeExtension$3(this.global, injectObjects));
          if (enableProxy) {
              this.global.registerTypeExtension(3, createTypeExtension$2(this.global));
          } else {
              this.global.registerTypeExtension(1, createTypeExtension$5(this.global, injectObjects));
          }
          this.global.registerTypeExtension(4, createTypeExtension(this.global));
          if (openStandardLibs) {
              this.cmodule.luaL_openlibs(this.global.address);
          }
      }
      doString(script) {
          return this.callByteCode((thread)=>thread.loadString(script));
      }
      doFile(filename) {
          return this.callByteCode((thread)=>thread.loadFile(filename));
      }
      doStringSync(script) {
          this.global.loadString(script);
          const result = this.global.runSync();
          return result[0];
      }
      doFileSync(filename) {
          this.global.loadFile(filename);
          const result = this.global.runSync();
          return result[0];
      }
      async callByteCode(loader) {
          const thread = this.global.newThread();
          const threadIndex = this.global.getTop();
          try {
              loader(thread);
              const result = await thread.run(0);
              if (result.length > 0) {
                  this.cmodule.lua_xmove(thread.address, this.global.address, result.length);
              }
              return result[0];
          } finally {
              this.global.remove(threadIndex);
          }
      }
  }

  var initWasmModule = (()=>{
      var _scriptDir = (typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('index.js',document.baseURI).href));

      return (function(initWasmModule) {
          initWasmModule = initWasmModule || {};
          var c;
          c || (c = typeof initWasmModule !== 'undefined' ? initWasmModule : {});
          var aa, ba;
          c.ready = new Promise(function(a, b) {
              aa = a;
              ba = b;
          }
          );
          var ca = Object.assign({}, c), da = "./this.program", ea = (a,b)=>{
              throw b;
          }
          , fa = "object" == typeof window, e = "function" == typeof importScripts, n = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, u = "", x, z, ha, fs, ia, ja;
          if (n)
              u = e ? require("path").dirname(u) + "/" : __dirname + "/",
              ja = ()=>{
                  ia || (fs = require("fs"),
                  ia = require("path"));
              }
              ,
              x = function(a, b) {
                  ja();
                  a = ia.normalize(a);
                  return fs.readFileSync(a, b ? void 0 : "utf8")
              }
              ,
              ha = a=>{
                  a = x(a, !0);
                  a.buffer || (a = new Uint8Array(a));
                  return a
              }
              ,
              z = (a,b,d)=>{
                  ja();
                  a = ia.normalize(a);
                  fs.readFile(a, function(f, g) {
                      f ? d(f) : b(g.buffer);
                  });
              }
              ,
              1 < process.argv.length && (da = process.argv[1].replace(/\\/g, "/")),
              process.argv.slice(2),
              ea = (a,b)=>{
                  if (noExitRuntime)
                      throw process.exitCode = a,
                      b;
                  b instanceof ka || A("exiting due to exception: " + b);
                  process.exit(a);
              }
              ,
              c.inspect = function() {
                  return "[Emscripten Module object]"
              }
              ;
          else if (fa || e)
              e ? u = self.location.href : "undefined" != typeof document && document.currentScript && (u = document.currentScript.src),
              _scriptDir && (u = _scriptDir),
              0 !== u.indexOf("blob:") ? u = u.substr(0, u.replace(/[?#].*/, "").lastIndexOf("/") + 1) : u = "",
              x = a=>{
                  var b = new XMLHttpRequest;
                  b.open("GET", a, !1);
                  b.send(null);
                  return b.responseText
              }
              ,
              e && (ha = a=>{
                  var b = new XMLHttpRequest;
                  b.open("GET", a, !1);
                  b.responseType = "arraybuffer";
                  b.send(null);
                  return new Uint8Array(b.response)
              }
              ),
              z = (a,b,d)=>{
                  var f = new XMLHttpRequest;
                  f.open("GET", a, !0);
                  f.responseType = "arraybuffer";
                  f.onload = ()=>{
                      200 == f.status || 0 == f.status && f.response ? b(f.response) : d();
                  }
                  ;
                  f.onerror = d;
                  f.send(null);
              }
              ;
          var la = c.print || console.log.bind(console)
            , A = c.printErr || console.warn.bind(console);
          Object.assign(c, ca);
          ca = null;
          c.thisProgram && (da = c.thisProgram);
          c.quit && (ea = c.quit);
          var ma = 0, B;
          c.wasmBinary && (B = c.wasmBinary);
          var noExitRuntime = c.noExitRuntime || !0;
          "object" != typeof WebAssembly && E("no native wasm support detected");
          var na, oa = !1, pa = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
          function F(a, b) {
              for (var d = b + NaN, f = b; a[f] && !(f >= d); )
                  ++f;
              if (16 < f - b && a.buffer && pa)
                  return pa.decode(a.subarray(b, f));
              for (d = ""; b < f; ) {
                  var g = a[b++];
                  if (g & 128) {
                      var h = a[b++] & 63;
                      if (192 == (g & 224))
                          d += String.fromCharCode((g & 31) << 6 | h);
                      else {
                          var l = a[b++] & 63;
                          g = 224 == (g & 240) ? (g & 15) << 12 | h << 6 | l : (g & 7) << 18 | h << 12 | l << 6 | a[b++] & 63;
                          65536 > g ? d += String.fromCharCode(g) : (g -= 65536,
                          d += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023));
                      }
                  } else
                      d += String.fromCharCode(g);
              }
              return d
          }
          function G(a) {
              return a ? F(H, a) : ""
          }
          function qa(a, b, d, f) {
              if (!(0 < f))
                  return 0;
              var g = d;
              f = d + f - 1;
              for (var h = 0; h < a.length; ++h) {
                  var l = a.charCodeAt(h);
                  if (55296 <= l && 57343 >= l) {
                      var p = a.charCodeAt(++h);
                      l = 65536 + ((l & 1023) << 10) | p & 1023;
                  }
                  if (127 >= l) {
                      if (d >= f)
                          break;
                      b[d++] = l;
                  } else {
                      if (2047 >= l) {
                          if (d + 1 >= f)
                              break;
                          b[d++] = 192 | l >> 6;
                      } else {
                          if (65535 >= l) {
                              if (d + 2 >= f)
                                  break;
                              b[d++] = 224 | l >> 12;
                          } else {
                              if (d + 3 >= f)
                                  break;
                              b[d++] = 240 | l >> 18;
                              b[d++] = 128 | l >> 12 & 63;
                          }
                          b[d++] = 128 | l >> 6 & 63;
                      }
                      b[d++] = 128 | l & 63;
                  }
              }
              b[d] = 0;
              return d - g
          }
          function ra(a) {
              for (var b = 0, d = 0; d < a.length; ++d) {
                  var f = a.charCodeAt(d);
                  55296 <= f && 57343 >= f && (f = 65536 + ((f & 1023) << 10) | a.charCodeAt(++d) & 1023);
                  127 >= f ? ++b : b = 2047 >= f ? b + 2 : 65535 >= f ? b + 3 : b + 4;
              }
              return b
          }
          var sa, I, H, ta, J, K, ua, va;
          function wa() {
              var a = na.buffer;
              sa = a;
              c.HEAP8 = I = new Int8Array(a);
              c.HEAP16 = ta = new Int16Array(a);
              c.HEAP32 = J = new Int32Array(a);
              c.HEAPU8 = H = new Uint8Array(a);
              c.HEAPU16 = new Uint16Array(a);
              c.HEAPU32 = K = new Uint32Array(a);
              c.HEAPF32 = ua = new Float32Array(a);
              c.HEAPF64 = va = new Float64Array(a);
          }
          var M, xa = [], ya = [], za = [];
          function Aa() {
              var a = c.preRun.shift();
              xa.unshift(a);
          }
          var N = 0
            , Ca = null;
          function Da() {
              N++;
              c.monitorRunDependencies && c.monitorRunDependencies(N);
          }
          function Ea() {
              N--;
              c.monitorRunDependencies && c.monitorRunDependencies(N);
              if (0 == N && (Ca)) {
                  var a = Ca;
                  Ca = null;
                  a();
              }
          }
          function E(a) {
              if (c.onAbort)
                  c.onAbort(a);
              a = "Aborted(" + a + ")";
              A(a);
              oa = !0;
              a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
              ba(a);
              throw a;
          }
          function Fa() {
              return O.startsWith("data:application/octet-stream;base64,")
          }
          var O;
          if (c.locateFile && false) {
              // 远程拉取
              if (O = "https://ark-release-1251316161.file.myqcloud.com/wasmoon/glue.wasm",
              !Fa()) {
                  var Ga = O;
                  O = c.locateFile ? c.locateFile(Ga, u) : u + Ga;
              }
          } else
              O = (new URL("https://ark-release-1251316161.file.myqcloud.com/wasmoon/glue.wasm",(typeof document === 'undefined' && typeof location === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : typeof document === 'undefined' ? location.href : (document.currentScript && document.currentScript.src || new URL('index.js',document.baseURI).href)))).toString();
          function Ha() {
              var a = O;
              try {
                  if (a == O && B)
                      return new Uint8Array(B);
                  if (ha)
                      return ha(a);
                  throw "both async and sync fetching of the wasm failed";
              } catch (b) {
                  E(b);
              }
          }
          function Ia() {
              if (!B && (fa || e)) {
                  if ("function" == typeof fetch)
                      return fetch(O, {
                          credentials: "same-origin"
                      }).then(function(a) {
                          if (!a.ok)
                              throw "failed to load wasm binary file at '" + O + "'";
                          return a.arrayBuffer()
                      }).catch(function() {
                          return Ha()
                      });
                  if (z)
                      return new Promise(function(a, b) {
                          z(O, function(d) {
                              a(new Uint8Array(d));
                          }, b);
                      }
                      )
              }
              return Promise.resolve().then(function() {
                  return Ha()
              })
          }
          var P, Q;
          function ka(a) {
              this.name = "ExitStatus";
              this.message = "Program terminated with exit(" + a + ")";
              this.status = a;
          }
          function Ja(a) {
              for (; 0 < a.length; )
                  a.shift()(c);
          }
          var Ka = (a,b)=>{
              for (var d = 0, f = a.length - 1; 0 <= f; f--) {
                  var g = a[f];
                  "." === g ? a.splice(f, 1) : ".." === g ? (a.splice(f, 1),
                  d++) : d && (a.splice(f, 1),
                  d--);
              }
              if (b)
                  for (; d; d--)
                      a.unshift("..");
              return a
          }
            , R = a=>{
              var b = "/" === a.charAt(0)
                , d = "/" === a.substr(-1);
              (a = Ka(a.split("/").filter(f=>!!f), !b).join("/")) || b || (a = ".");
              a && d && (a += "/");
              return (b ? "/" : "") + a
          }
            , La = a=>{
              var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
              a = b[0];
              b = b[1];
              if (!a && !b)
                  return ".";
              b && (b = b.substr(0, b.length - 1));
              return a + b
          }
            , S = a=>{
              if ("/" === a)
                  return "/";
              a = R(a);
              a = a.replace(/\/$/, "");
              var b = a.lastIndexOf("/");
              return -1 === b ? a : a.substr(b + 1)
          }
            , Ma = (a,b)=>R(a + "/" + b);
          function Na() {
              if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) {
                  var a = new Uint8Array(1);
                  return function() {
                      crypto.getRandomValues(a);
                      return a[0]
                  }
              }
              if (n)
                  try {
                      var b = require("crypto");
                      return function() {
                          return b.randomBytes(1)[0]
                      }
                  } catch (d) {}
              return function() {
                  E("randomDevice");
              }
          }
          function T() {
              for (var a = "", b = !1, d = arguments.length - 1; -1 <= d && !b; d--) {
                  b = 0 <= d ? arguments[d] : U.cwd();
                  if ("string" != typeof b)
                      throw new TypeError("Arguments to path.resolve must be strings");
                  if (!b)
                      return "";
                  a = b + "/" + a;
                  b = "/" === b.charAt(0);
              }
              a = Ka(a.split("/").filter(f=>!!f), !b).join("/");
              return (b ? "/" : "") + a || "."
          }
          var Oa = (a,b)=>{
              function d(l) {
                  for (var p = 0; p < l.length && "" === l[p]; p++)
                      ;
                  for (var r = l.length - 1; 0 <= r && "" === l[r]; r--)
                      ;
                  return p > r ? [] : l.slice(p, r - p + 1)
              }
              a = T(a).substr(1);
              b = T(b).substr(1);
              a = d(a.split("/"));
              b = d(b.split("/"));
              for (var f = Math.min(a.length, b.length), g = f, h = 0; h < f; h++)
                  if (a[h] !== b[h]) {
                      g = h;
                      break
                  }
              f = [];
              for (h = g; h < a.length; h++)
                  f.push("..");
              f = f.concat(b.slice(g));
              return f.join("/")
          }
          ;
          function Pa(a, b) {
              var d = Array(ra(a) + 1);
              a = qa(a, d, 0, d.length);
              b && (d.length = a);
              return d
          }
          var Qa = [];
          function Ra(a, b) {
              Qa[a] = {
                  input: [],
                  output: [],
                  dd: b
              };
              U.Od(a, Sa);
          }
          var Sa = {
              open: function(a) {
                  var b = Qa[a.node.rdev];
                  if (!b)
                      throw new U.Bc(43);
                  a.tty = b;
                  a.seekable = !1;
              },
              close: function(a) {
                  a.tty.dd.flush(a.tty);
              },
              flush: function(a) {
                  a.tty.dd.flush(a.tty);
              },
              read: function(a, b, d, f) {
                  if (!a.tty || !a.tty.dd.ae)
                      throw new U.Bc(60);
                  for (var g = 0, h = 0; h < f; h++) {
                      try {
                          var l = a.tty.dd.ae(a.tty);
                      } catch (p) {
                          throw new U.Bc(29);
                      }
                      if (void 0 === l && 0 === g)
                          throw new U.Bc(6);
                      if (null === l || void 0 === l)
                          break;
                      g++;
                      b[d + h] = l;
                  }
                  g && (a.node.timestamp = Date.now());
                  return g
              },
              write: function(a, b, d, f) {
                  if (!a.tty || !a.tty.dd.Ld)
                      throw new U.Bc(60);
                  try {
                      for (var g = 0; g < f; g++)
                          a.tty.dd.Ld(a.tty, b[d + g]);
                  } catch (h) {
                      throw new U.Bc(29);
                  }
                  f && (a.node.timestamp = Date.now());
                  return g
              }
          }
            , Ta = {
              ae: function(a) {
                  if (!a.input.length) {
                      var b = null;
                      if (n) {
                          var d = Buffer.alloc(256)
                            , f = 0;
                          try {
                              f = fs.readSync(process.stdin.fd, d, 0, 256, -1);
                          } catch (g) {
                              if (g.toString().includes("EOF"))
                                  f = 0;
                              else
                                  throw g;
                          }
                          0 < f ? b = d.slice(0, f).toString("utf-8") : b = null;
                      } else
                          "undefined" != typeof window && "function" == typeof window.prompt ? (b = window.prompt("Input: "),
                          null !== b && (b += "\n")) : "function" == typeof readline && (b = readline(),
                          null !== b && (b += "\n"));
                      if (!b)
                          return null;
                      a.input = Pa(b, !0);
                  }
                  return a.input.shift()
              },
              Ld: function(a, b) {
                  null === b || 10 === b ? (la(F(a.output, 0)),
                  a.output = []) : 0 != b && a.output.push(b);
              },
              flush: function(a) {
                  a.output && 0 < a.output.length && (la(F(a.output, 0)),
                  a.output = []);
              }
          }
            , Ua = {
              Ld: function(a, b) {
                  null === b || 10 === b ? (A(F(a.output, 0)),
                  a.output = []) : 0 != b && a.output.push(b);
              },
              flush: function(a) {
                  a.output && 0 < a.output.length && (A(F(a.output, 0)),
                  a.output = []);
              }
          }
            , V = {
              Pc: null,
              Hc: function() {
                  return V.createNode(null, "/", 16895, 0)
              },
              createNode: function(a, b, d, f) {
                  if (U.Ae(d) || U.isFIFO(d))
                      throw new U.Bc(63);
                  V.Pc || (V.Pc = {
                      dir: {
                          node: {
                              Mc: V.Cc.Mc,
                              Kc: V.Cc.Kc,
                              lookup: V.Cc.lookup,
                              Tc: V.Cc.Tc,
                              rename: V.Cc.rename,
                              unlink: V.Cc.unlink,
                              rmdir: V.Cc.rmdir,
                              readdir: V.Cc.readdir,
                              symlink: V.Cc.symlink
                          },
                          stream: {
                              Nc: V.Ec.Nc
                          }
                      },
                      file: {
                          node: {
                              Mc: V.Cc.Mc,
                              Kc: V.Cc.Kc
                          },
                          stream: {
                              Nc: V.Ec.Nc,
                              read: V.Ec.read,
                              write: V.Ec.write,
                              gd: V.Ec.gd,
                              cd: V.Ec.cd,
                              md: V.Ec.md
                          }
                      },
                      link: {
                          node: {
                              Mc: V.Cc.Mc,
                              Kc: V.Cc.Kc,
                              readlink: V.Cc.readlink
                          },
                          stream: {}
                      },
                      Td: {
                          node: {
                              Mc: V.Cc.Mc,
                              Kc: V.Cc.Kc
                          },
                          stream: U.pe
                      }
                  });
                  d = U.createNode(a, b, d, f);
                  U.Jc(d.mode) ? (d.Cc = V.Pc.dir.node,
                  d.Ec = V.Pc.dir.stream,
                  d.Dc = {}) : U.isFile(d.mode) ? (d.Cc = V.Pc.file.node,
                  d.Ec = V.Pc.file.stream,
                  d.Gc = 0,
                  d.Dc = null) : U.jd(d.mode) ? (d.Cc = V.Pc.link.node,
                  d.Ec = V.Pc.link.stream) : U.pd(d.mode) && (d.Cc = V.Pc.Td.node,
                  d.Ec = V.Pc.Td.stream);
                  d.timestamp = Date.now();
                  a && (a.Dc[b] = d,
                  a.timestamp = d.timestamp);
                  return d
              },
              Ye: function(a) {
                  return a.Dc ? a.Dc.subarray ? a.Dc.subarray(0, a.Gc) : new Uint8Array(a.Dc) : new Uint8Array(0)
              },
              Yd: function(a, b) {
                  var d = a.Dc ? a.Dc.length : 0;
                  d >= b || (b = Math.max(b, d * (1048576 > d ? 2 : 1.125) >>> 0),
                  0 != d && (b = Math.max(b, 256)),
                  d = a.Dc,
                  a.Dc = new Uint8Array(b),
                  0 < a.Gc && a.Dc.set(d.subarray(0, a.Gc), 0));
              },
              Ke: function(a, b) {
                  if (a.Gc != b)
                      if (0 == b)
                          a.Dc = null,
                          a.Gc = 0;
                      else {
                          var d = a.Dc;
                          a.Dc = new Uint8Array(b);
                          d && a.Dc.set(d.subarray(0, Math.min(b, a.Gc)));
                          a.Gc = b;
                      }
              },
              Cc: {
                  Mc: function(a) {
                      var b = {};
                      b.dev = U.pd(a.mode) ? a.id : 1;
                      b.ino = a.id;
                      b.mode = a.mode;
                      b.nlink = 1;
                      b.uid = 0;
                      b.gid = 0;
                      b.rdev = a.rdev;
                      U.Jc(a.mode) ? b.size = 4096 : U.isFile(a.mode) ? b.size = a.Gc : U.jd(a.mode) ? b.size = a.link.length : b.size = 0;
                      b.atime = new Date(a.timestamp);
                      b.mtime = new Date(a.timestamp);
                      b.ctime = new Date(a.timestamp);
                      b.me = 4096;
                      b.blocks = Math.ceil(b.size / b.me);
                      return b
                  },
                  Kc: function(a, b) {
                      void 0 !== b.mode && (a.mode = b.mode);
                      void 0 !== b.timestamp && (a.timestamp = b.timestamp);
                      void 0 !== b.size && V.Ke(a, b.size);
                  },
                  lookup: function() {
                      throw U.Bd[44];
                  },
                  Tc: function(a, b, d, f) {
                      return V.createNode(a, b, d, f)
                  },
                  rename: function(a, b, d) {
                      if (U.Jc(a.mode)) {
                          try {
                              var f = U.Sc(b, d);
                          } catch (h) {}
                          if (f)
                              for (var g in f.Dc)
                                  throw new U.Bc(55);
                      }
                      delete a.parent.Dc[a.name];
                      a.parent.timestamp = Date.now();
                      a.name = d;
                      b.Dc[d] = a;
                      b.timestamp = a.parent.timestamp;
                      a.parent = b;
                  },
                  unlink: function(a, b) {
                      delete a.Dc[b];
                      a.timestamp = Date.now();
                  },
                  rmdir: function(a, b) {
                      var d = U.Sc(a, b), f;
                      for (f in d.Dc)
                          throw new U.Bc(55);
                      delete a.Dc[b];
                      a.timestamp = Date.now();
                  },
                  readdir: function(a) {
                      var b = [".", ".."], d;
                      for (d in a.Dc)
                          a.Dc.hasOwnProperty(d) && b.push(d);
                      return b
                  },
                  symlink: function(a, b, d) {
                      a = V.createNode(a, b, 41471, 0);
                      a.link = d;
                      return a
                  },
                  readlink: function(a) {
                      if (!U.jd(a.mode))
                          throw new U.Bc(28);
                      return a.link
                  }
              },
              Ec: {
                  read: function(a, b, d, f, g) {
                      var h = a.node.Dc;
                      if (g >= a.node.Gc)
                          return 0;
                      a = Math.min(a.node.Gc - g, f);
                      if (8 < a && h.subarray)
                          b.set(h.subarray(g, g + a), d);
                      else
                          for (f = 0; f < a; f++)
                              b[d + f] = h[g + f];
                      return a
                  },
                  write: function(a, b, d, f, g, h) {
                      b.buffer === I.buffer && (h = !1);
                      if (!f)
                          return 0;
                      a = a.node;
                      a.timestamp = Date.now();
                      if (b.subarray && (!a.Dc || a.Dc.subarray)) {
                          if (h)
                              return a.Dc = b.subarray(d, d + f),
                              a.Gc = f;
                          if (0 === a.Gc && 0 === g)
                              return a.Dc = b.slice(d, d + f),
                              a.Gc = f;
                          if (g + f <= a.Gc)
                              return a.Dc.set(b.subarray(d, d + f), g),
                              f
                      }
                      V.Yd(a, g + f);
                      if (a.Dc.subarray && b.subarray)
                          a.Dc.set(b.subarray(d, d + f), g);
                      else
                          for (h = 0; h < f; h++)
                              a.Dc[g + h] = b[d + h];
                      a.Gc = Math.max(a.Gc, g + f);
                      return f
                  },
                  Nc: function(a, b, d) {
                      1 === d ? b += a.position : 2 === d && U.isFile(a.node.mode) && (b += a.node.Gc);
                      if (0 > b)
                          throw new U.Bc(28);
                      return b
                  },
                  gd: function(a, b, d) {
                      V.Yd(a.node, b + d);
                      a.node.Gc = Math.max(a.node.Gc, b + d);
                  },
                  cd: function(a, b, d, f, g) {
                      if (!U.isFile(a.node.mode))
                          throw new U.Bc(43);
                      a = a.node.Dc;
                      if (g & 2 || a.buffer !== sa) {
                          if (0 < d || d + b < a.length)
                              a.subarray ? a = a.subarray(d, d + b) : a = Array.prototype.slice.call(a, d, d + b);
                          d = !0;
                          E();
                          b = void 0;
                          if (!b)
                              throw new U.Bc(48);
                          I.set(a, b);
                      } else
                          d = !1,
                          b = a.byteOffset;
                      return {
                          ef: b,
                          Se: d
                      }
                  },
                  md: function(a, b, d, f, g) {
                      if (!U.isFile(a.node.mode))
                          throw new U.Bc(43);
                      if (g & 2)
                          return 0;
                      V.Ec.write(a, b, 0, f, d, !1);
                      return 0
                  }
              }
          };
          function Va(a, b, d) {
              var f = "al " + a;
              z(a, function(g) {
                  g || E('Loading data file "' + a + '" failed (no arrayBuffer).');
                  b(new Uint8Array(g));
                  f && Ea();
              }, function() {
                  if (d)
                      d();
                  else
                      throw 'Loading data file "' + a + '" failed.';
              });
              f && Da();
          }
          var U = {
              root: null,
              ld: [],
              Wd: {},
              streams: [],
              Fe: 1,
              Oc: null,
              Vd: "/",
              Fd: !1,
              ee: !0,
              Bc: null,
              Bd: {},
              xe: null,
              td: 0,
              Fc: (a,b={})=>{
                  a = T(U.cwd(), a);
                  if (!a)
                      return {
                          path: "",
                          node: null
                      };
                  b = Object.assign({
                      zd: !0,
                      Nd: 0
                  }, b);
                  if (8 < b.Nd)
                      throw new U.Bc(32);
                  a = Ka(a.split("/").filter(l=>!!l), !1);
                  for (var d = U.root, f = "/", g = 0; g < a.length; g++) {
                      var h = g === a.length - 1;
                      if (h && b.parent)
                          break;
                      d = U.Sc(d, a[g]);
                      f = R(f + "/" + a[g]);
                      U.Xc(d) && (!h || h && b.zd) && (d = d.kd.root);
                      if (!h || b.Lc)
                          for (h = 0; U.jd(d.mode); )
                              if (d = U.readlink(f),
                              f = T(La(f), d),
                              d = U.Fc(f, {
                                  Nd: b.Nd + 1
                              }).node,
                              40 < h++)
                                  throw new U.Bc(32);
                  }
                  return {
                      path: f,
                      node: d
                  }
              }
              ,
              Vc: a=>{
                  for (var b; ; ) {
                      if (U.qd(a))
                          return a = a.Hc.fe,
                          b ? "/" !== a[a.length - 1] ? a + "/" + b : a + b : a;
                      b = b ? a.name + "/" + b : a.name;
                      a = a.parent;
                  }
              }
              ,
              Ed: (a,b)=>{
                  for (var d = 0, f = 0; f < b.length; f++)
                      d = (d << 5) - d + b.charCodeAt(f) | 0;
                  return (a + d >>> 0) % U.Oc.length
              }
              ,
              ce: a=>{
                  var b = U.Ed(a.parent.id, a.name);
                  a.Zc = U.Oc[b];
                  U.Oc[b] = a;
              }
              ,
              de: a=>{
                  var b = U.Ed(a.parent.id, a.name);
                  if (U.Oc[b] === a)
                      U.Oc[b] = a.Zc;
                  else
                      for (b = U.Oc[b]; b; ) {
                          if (b.Zc === a) {
                              b.Zc = a.Zc;
                              break
                          }
                          b = b.Zc;
                      }
              }
              ,
              Sc: (a,b)=>{
                  var d = U.Ce(a);
                  if (d)
                      throw new U.Bc(d,a);
                  for (d = U.Oc[U.Ed(a.id, b)]; d; d = d.Zc) {
                      var f = d.name;
                      if (d.parent.id === a.id && f === b)
                          return d
                  }
                  return U.lookup(a, b)
              }
              ,
              createNode: (a,b,d,f)=>{
                  a = new U.ie(a,b,d,f);
                  U.ce(a);
                  return a
              }
              ,
              yd: a=>{
                  U.de(a);
              }
              ,
              qd: a=>a === a.parent,
              Xc: a=>!!a.kd,
              isFile: a=>32768 === (a & 61440),
              Jc: a=>16384 === (a & 61440),
              jd: a=>40960 === (a & 61440),
              pd: a=>8192 === (a & 61440),
              Ae: a=>24576 === (a & 61440),
              isFIFO: a=>4096 === (a & 61440),
              isSocket: a=>49152 === (a & 49152),
              ye: {
                  r: 0,
                  "r+": 2,
                  w: 577,
                  "w+": 578,
                  a: 1089,
                  "a+": 1090
              },
              Ee: a=>{
                  var b = U.ye[a];
                  if ("undefined" == typeof b)
                      throw Error("Unknown file open mode: " + a);
                  return b
              }
              ,
              Zd: a=>{
                  var b = ["r", "w", "rw"][a & 3];
                  a & 512 && (b += "w");
                  return b
              }
              ,
              $c: (a,b)=>{
                  if (U.ee)
                      return 0;
                  if (!b.includes("r") || a.mode & 292) {
                      if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73))
                          return 2
                  } else
                      return 2;
                  return 0
              }
              ,
              Ce: a=>{
                  var b = U.$c(a, "x");
                  return b ? b : a.Cc.lookup ? 0 : 2
              }
              ,
              Kd: (a,b)=>{
                  try {
                      return U.Sc(a, b),
                      20
                  } catch (d) {}
                  return U.$c(a, "wx")
              }
              ,
              rd: (a,b,d)=>{
                  try {
                      var f = U.Sc(a, b);
                  } catch (g) {
                      return g.Ic
                  }
                  if (a = U.$c(a, "wx"))
                      return a;
                  if (d) {
                      if (!U.Jc(f.mode))
                          return 54;
                      if (U.qd(f) || U.Vc(f) === U.cwd())
                          return 10
                  } else if (U.Jc(f.mode))
                      return 31;
                  return 0
              }
              ,
              De: (a,b)=>a ? U.jd(a.mode) ? 32 : U.Jc(a.mode) && ("r" !== U.Zd(b) || b & 512) ? 31 : U.$c(a, U.Zd(b)) : 44,
              je: 4096,
              Ge: (a=0,b=U.je)=>{
                  for (; a <= b; a++)
                      if (!U.streams[a])
                          return a;
                  throw new U.Bc(33);
              }
              ,
              Wc: a=>U.streams[a],
              xd: (a,b,d)=>{
                  U.nd || (U.nd = function() {
                      this.Rc = {};
                  }
                  ,
                  U.nd.prototype = {},
                  Object.defineProperties(U.nd.prototype, {
                      object: {
                          get: function() {
                              return this.node
                          },
                          set: function(f) {
                              this.node = f;
                          }
                      },
                      flags: {
                          get: function() {
                              return this.Rc.flags
                          },
                          set: function(f) {
                              this.Rc.flags = f;
                          }
                      },
                      position: {
                          get: function() {
                              return this.Rc.position
                          },
                          set: function(f) {
                              this.Rc.position = f;
                          }
                      }
                  }));
                  a = Object.assign(new U.nd, a);
                  b = U.Ge(b, d);
                  a.fd = b;
                  return U.streams[b] = a
              }
              ,
              qe: a=>{
                  U.streams[a] = null;
              }
              ,
              pe: {
                  open: a=>{
                      a.Ec = U.ze(a.node.rdev).Ec;
                      a.Ec.open && a.Ec.open(a);
                  }
                  ,
                  Nc: ()=>{
                      throw new U.Bc(70);
                  }
              },
              Jd: a=>a >> 8,
              af: a=>a & 255,
              Yc: (a,b)=>a << 8 | b,
              Od: (a,b)=>{
                  U.Wd[a] = {
                      Ec: b
                  };
              }
              ,
              ze: a=>U.Wd[a],
              $d: a=>{
                  var b = [];
                  for (a = [a]; a.length; ) {
                      var d = a.pop();
                      b.push(d);
                      a.push.apply(a, d.ld);
                  }
                  return b
              }
              ,
              ge: (a,b)=>{
                  function d(l) {
                      U.td--;
                      return b(l)
                  }
                  function f(l) {
                      if (l) {
                          if (!f.we)
                              return f.we = !0,
                              d(l)
                      } else
                          ++h >= g.length && d(null);
                  }
                  "function" == typeof a && (b = a,
                  a = !1);
                  U.td++;
                  1 < U.td && A("warning: " + U.td + " FS.syncfs operations in flight at once, probably just doing extra work");
                  var g = U.$d(U.root.Hc)
                    , h = 0;
                  g.forEach(l=>{
                      if (!l.type.ge)
                          return f(null);
                      l.type.ge(l, a, f);
                  }
                  );
              }
              ,
              Hc: (a,b,d)=>{
                  var f = "/" === d
                    , g = !d;
                  if (f && U.root)
                      throw new U.Bc(10);
                  if (!f && !g) {
                      var h = U.Fc(d, {
                          zd: !1
                      });
                      d = h.path;
                      h = h.node;
                      if (U.Xc(h))
                          throw new U.Bc(10);
                      if (!U.Jc(h.mode))
                          throw new U.Bc(54);
                  }
                  b = {
                      type: a,
                      df: b,
                      fe: d,
                      ld: []
                  };
                  a = a.Hc(b);
                  a.Hc = b;
                  b.root = a;
                  f ? U.root = a : h && (h.kd = b,
                  h.Hc && h.Hc.ld.push(b));
                  return a
              }
              ,
              lf: a=>{
                  a = U.Fc(a, {
                      zd: !1
                  });
                  if (!U.Xc(a.node))
                      throw new U.Bc(28);
                  a = a.node;
                  var b = a.kd
                    , d = U.$d(b);
                  Object.keys(U.Oc).forEach(f=>{
                      for (f = U.Oc[f]; f; ) {
                          var g = f.Zc;
                          d.includes(f.Hc) && U.yd(f);
                          f = g;
                      }
                  }
                  );
                  a.kd = null;
                  a.Hc.ld.splice(a.Hc.ld.indexOf(b), 1);
              }
              ,
              lookup: (a,b)=>a.Cc.lookup(a, b),
              Tc: (a,b,d)=>{
                  var f = U.Fc(a, {
                      parent: !0
                  }).node;
                  a = S(a);
                  if (!a || "." === a || ".." === a)
                      throw new U.Bc(28);
                  var g = U.Kd(f, a);
                  if (g)
                      throw new U.Bc(g);
                  if (!f.Cc.Tc)
                      throw new U.Bc(63);
                  return f.Cc.Tc(f, a, b, d)
              }
              ,
              create: (a,b)=>U.Tc(a, (void 0 !== b ? b : 438) & 4095 | 32768, 0),
              mkdir: (a,b)=>U.Tc(a, (void 0 !== b ? b : 511) & 1023 | 16384, 0),
              bf: (a,b)=>{
                  a = a.split("/");
                  for (var d = "", f = 0; f < a.length; ++f)
                      if (a[f]) {
                          d += "/" + a[f];
                          try {
                              U.mkdir(d, b);
                          } catch (g) {
                              if (20 != g.Ic)
                                  throw g;
                          }
                      }
              }
              ,
              sd: (a,b,d)=>{
                  "undefined" == typeof d && (d = b,
                  b = 438);
                  return U.Tc(a, b | 8192, d)
              }
              ,
              symlink: (a,b)=>{
                  if (!T(a))
                      throw new U.Bc(44);
                  var d = U.Fc(b, {
                      parent: !0
                  }).node;
                  if (!d)
                      throw new U.Bc(44);
                  b = S(b);
                  var f = U.Kd(d, b);
                  if (f)
                      throw new U.Bc(f);
                  if (!d.Cc.symlink)
                      throw new U.Bc(63);
                  return d.Cc.symlink(d, b, a)
              }
              ,
              rename: (a,b)=>{
                  var d = La(a)
                    , f = La(b)
                    , g = S(a)
                    , h = S(b);
                  var l = U.Fc(a, {
                      parent: !0
                  });
                  var p = l.node;
                  l = U.Fc(b, {
                      parent: !0
                  });
                  l = l.node;
                  if (!p || !l)
                      throw new U.Bc(44);
                  if (p.Hc !== l.Hc)
                      throw new U.Bc(75);
                  var r = U.Sc(p, g);
                  a = Oa(a, f);
                  if ("." !== a.charAt(0))
                      throw new U.Bc(28);
                  a = Oa(b, d);
                  if ("." !== a.charAt(0))
                      throw new U.Bc(55);
                  try {
                      var m = U.Sc(l, h);
                  } catch (q) {}
                  if (r !== m) {
                      b = U.Jc(r.mode);
                      if (g = U.rd(p, g, b))
                          throw new U.Bc(g);
                      if (g = m ? U.rd(l, h, b) : U.Kd(l, h))
                          throw new U.Bc(g);
                      if (!p.Cc.rename)
                          throw new U.Bc(63);
                      if (U.Xc(r) || m && U.Xc(m))
                          throw new U.Bc(10);
                      if (l !== p && (g = U.$c(p, "w")))
                          throw new U.Bc(g);
                      U.de(r);
                      try {
                          p.Cc.rename(r, l, h);
                      } catch (q) {
                          throw q;
                      } finally {
                          U.ce(r);
                      }
                  }
              }
              ,
              rmdir: a=>{
                  var b = U.Fc(a, {
                      parent: !0
                  }).node;
                  a = S(a);
                  var d = U.Sc(b, a)
                    , f = U.rd(b, a, !0);
                  if (f)
                      throw new U.Bc(f);
                  if (!b.Cc.rmdir)
                      throw new U.Bc(63);
                  if (U.Xc(d))
                      throw new U.Bc(10);
                  b.Cc.rmdir(b, a);
                  U.yd(d);
              }
              ,
              readdir: a=>{
                  a = U.Fc(a, {
                      Lc: !0
                  }).node;
                  if (!a.Cc.readdir)
                      throw new U.Bc(54);
                  return a.Cc.readdir(a)
              }
              ,
              unlink: a=>{
                  var b = U.Fc(a, {
                      parent: !0
                  }).node;
                  if (!b)
                      throw new U.Bc(44);
                  a = S(a);
                  var d = U.Sc(b, a)
                    , f = U.rd(b, a, !1);
                  if (f)
                      throw new U.Bc(f);
                  if (!b.Cc.unlink)
                      throw new U.Bc(63);
                  if (U.Xc(d))
                      throw new U.Bc(10);
                  b.Cc.unlink(b, a);
                  U.yd(d);
              }
              ,
              readlink: a=>{
                  a = U.Fc(a).node;
                  if (!a)
                      throw new U.Bc(44);
                  if (!a.Cc.readlink)
                      throw new U.Bc(28);
                  return T(U.Vc(a.parent), a.Cc.readlink(a))
              }
              ,
              stat: (a,b)=>{
                  a = U.Fc(a, {
                      Lc: !b
                  }).node;
                  if (!a)
                      throw new U.Bc(44);
                  if (!a.Cc.Mc)
                      throw new U.Bc(63);
                  return a.Cc.Mc(a)
              }
              ,
              lstat: a=>U.stat(a, !0),
              chmod: (a,b,d)=>{
                  a = "string" == typeof a ? U.Fc(a, {
                      Lc: !d
                  }).node : a;
                  if (!a.Cc.Kc)
                      throw new U.Bc(63);
                  a.Cc.Kc(a, {
                      mode: b & 4095 | a.mode & -4096,
                      timestamp: Date.now()
                  });
              }
              ,
              lchmod: (a,b)=>{
                  U.chmod(a, b, !0);
              }
              ,
              fchmod: (a,b)=>{
                  a = U.Wc(a);
                  if (!a)
                      throw new U.Bc(8);
                  U.chmod(a.node, b);
              }
              ,
              chown: (a,b,d,f)=>{
                  a = "string" == typeof a ? U.Fc(a, {
                      Lc: !f
                  }).node : a;
                  if (!a.Cc.Kc)
                      throw new U.Bc(63);
                  a.Cc.Kc(a, {
                      timestamp: Date.now()
                  });
              }
              ,
              lchown: (a,b,d)=>{
                  U.chown(a, b, d, !0);
              }
              ,
              fchown: (a,b,d)=>{
                  a = U.Wc(a);
                  if (!a)
                      throw new U.Bc(8);
                  U.chown(a.node, b, d);
              }
              ,
              truncate: (a,b)=>{
                  if (0 > b)
                      throw new U.Bc(28);
                  a = "string" == typeof a ? U.Fc(a, {
                      Lc: !0
                  }).node : a;
                  if (!a.Cc.Kc)
                      throw new U.Bc(63);
                  if (U.Jc(a.mode))
                      throw new U.Bc(31);
                  if (!U.isFile(a.mode))
                      throw new U.Bc(28);
                  var d = U.$c(a, "w");
                  if (d)
                      throw new U.Bc(d);
                  a.Cc.Kc(a, {
                      size: b,
                      timestamp: Date.now()
                  });
              }
              ,
              Xe: (a,b)=>{
                  a = U.Wc(a);
                  if (!a)
                      throw new U.Bc(8);
                  if (0 === (a.flags & 2097155))
                      throw new U.Bc(28);
                  U.truncate(a.node, b);
              }
              ,
              mf: (a,b,d)=>{
                  a = U.Fc(a, {
                      Lc: !0
                  }).node;
                  a.Cc.Kc(a, {
                      timestamp: Math.max(b, d)
                  });
              }
              ,
              open: (a,b,d)=>{
                  if ("" === a)
                      throw new U.Bc(44);
                  b = "string" == typeof b ? U.Ee(b) : b;
                  d = b & 64 ? ("undefined" == typeof d ? 438 : d) & 4095 | 32768 : 0;
                  if ("object" == typeof a)
                      var f = a;
                  else {
                      a = R(a);
                      try {
                          f = U.Fc(a, {
                              Lc: !(b & 131072)
                          }).node;
                      } catch (h) {}
                  }
                  var g = !1;
                  if (b & 64)
                      if (f) {
                          if (b & 128)
                              throw new U.Bc(20);
                      } else
                          f = U.Tc(a, d, 0),
                          g = !0;
                  if (!f)
                      throw new U.Bc(44);
                  U.pd(f.mode) && (b &= -513);
                  if (b & 65536 && !U.Jc(f.mode))
                      throw new U.Bc(54);
                  if (!g && (d = U.De(f, b)))
                      throw new U.Bc(d);
                  b & 512 && !g && U.truncate(f, 0);
                  b &= -131713;
                  f = U.xd({
                      node: f,
                      path: U.Vc(f),
                      flags: b,
                      seekable: !0,
                      position: 0,
                      Ec: f.Ec,
                      Re: [],
                      error: !1
                  });
                  f.Ec.open && f.Ec.open(f);
                  !c.logReadFiles || b & 1 || (U.Md || (U.Md = {}),
                  a in U.Md || (U.Md[a] = 1));
                  return f
              }
              ,
              close: a=>{
                  if (U.hd(a))
                      throw new U.Bc(8);
                  a.Dd && (a.Dd = null);
                  try {
                      a.Ec.close && a.Ec.close(a);
                  } catch (b) {
                      throw b;
                  } finally {
                      U.qe(a.fd);
                  }
                  a.fd = null;
              }
              ,
              hd: a=>null === a.fd,
              Nc: (a,b,d)=>{
                  if (U.hd(a))
                      throw new U.Bc(8);
                  if (!a.seekable || !a.Ec.Nc)
                      throw new U.Bc(70);
                  if (0 != d && 1 != d && 2 != d)
                      throw new U.Bc(28);
                  a.position = a.Ec.Nc(a, b, d);
                  a.Re = [];
                  return a.position
              }
              ,
              read: (a,b,d,f,g)=>{
                  if (0 > f || 0 > g)
                      throw new U.Bc(28);
                  if (U.hd(a))
                      throw new U.Bc(8);
                  if (1 === (a.flags & 2097155))
                      throw new U.Bc(8);
                  if (U.Jc(a.node.mode))
                      throw new U.Bc(31);
                  if (!a.Ec.read)
                      throw new U.Bc(28);
                  var h = "undefined" != typeof g;
                  if (!h)
                      g = a.position;
                  else if (!a.seekable)
                      throw new U.Bc(70);
                  b = a.Ec.read(a, b, d, f, g);
                  h || (a.position += b);
                  return b
              }
              ,
              write: (a,b,d,f,g,h)=>{
                  if (0 > f || 0 > g)
                      throw new U.Bc(28);
                  if (U.hd(a))
                      throw new U.Bc(8);
                  if (0 === (a.flags & 2097155))
                      throw new U.Bc(8);
                  if (U.Jc(a.node.mode))
                      throw new U.Bc(31);
                  if (!a.Ec.write)
                      throw new U.Bc(28);
                  a.seekable && a.flags & 1024 && U.Nc(a, 0, 2);
                  var l = "undefined" != typeof g;
                  if (!l)
                      g = a.position;
                  else if (!a.seekable)
                      throw new U.Bc(70);
                  b = a.Ec.write(a, b, d, f, g, h);
                  l || (a.position += b);
                  return b
              }
              ,
              gd: (a,b,d)=>{
                  if (U.hd(a))
                      throw new U.Bc(8);
                  if (0 > b || 0 >= d)
                      throw new U.Bc(28);
                  if (0 === (a.flags & 2097155))
                      throw new U.Bc(8);
                  if (!U.isFile(a.node.mode) && !U.Jc(a.node.mode))
                      throw new U.Bc(43);
                  if (!a.Ec.gd)
                      throw new U.Bc(138);
                  a.Ec.gd(a, b, d);
              }
              ,
              cd: (a,b,d,f,g)=>{
                  if (0 !== (f & 2) && 0 === (g & 2) && 2 !== (a.flags & 2097155))
                      throw new U.Bc(2);
                  if (1 === (a.flags & 2097155))
                      throw new U.Bc(2);
                  if (!a.Ec.cd)
                      throw new U.Bc(43);
                  return a.Ec.cd(a, b, d, f, g)
              }
              ,
              md: (a,b,d,f,g)=>a && a.Ec.md ? a.Ec.md(a, b, d, f, g) : 0,
              cf: ()=>0,
              Gd: (a,b,d)=>{
                  if (!a.Ec.Gd)
                      throw new U.Bc(59);
                  return a.Ec.Gd(a, b, d)
              }
              ,
              readFile: (a,b={})=>{
                  b.flags = b.flags || 0;
                  b.encoding = b.encoding || "binary";
                  if ("utf8" !== b.encoding && "binary" !== b.encoding)
                      throw Error('Invalid encoding type "' + b.encoding + '"');
                  var d, f = U.open(a, b.flags);
                  a = U.stat(a).size;
                  var g = new Uint8Array(a);
                  U.read(f, g, 0, a, 0);
                  "utf8" === b.encoding ? d = F(g, 0) : "binary" === b.encoding && (d = g);
                  U.close(f);
                  return d
              }
              ,
              writeFile: (a,b,d={})=>{
                  d.flags = d.flags || 577;
                  a = U.open(a, d.flags, d.mode);
                  if ("string" == typeof b) {
                      var f = new Uint8Array(ra(b) + 1);
                      b = qa(b, f, 0, f.length);
                      U.write(a, f, 0, b, void 0, d.oe);
                  } else if (ArrayBuffer.isView(b))
                      U.write(a, b, 0, b.byteLength, void 0, d.oe);
                  else
                      throw Error("Unsupported data type");
                  U.close(a);
              }
              ,
              cwd: ()=>U.Vd,
              chdir: a=>{
                  a = U.Fc(a, {
                      Lc: !0
                  });
                  if (null === a.node)
                      throw new U.Bc(44);
                  if (!U.Jc(a.node.mode))
                      throw new U.Bc(54);
                  var b = U.$c(a.node, "x");
                  if (b)
                      throw new U.Bc(b);
                  U.Vd = a.path;
              }
              ,
              se: ()=>{
                  U.mkdir("/tmp");
                  U.mkdir("/home");
                  U.mkdir("/home/web_user");
              }
              ,
              re: ()=>{
                  U.mkdir("/dev");
                  U.Od(U.Yc(1, 3), {
                      read: ()=>0,
                      write: (b,d,f,g)=>g
                  });
                  U.sd("/dev/null", U.Yc(1, 3));
                  Ra(U.Yc(5, 0), Ta);
                  Ra(U.Yc(6, 0), Ua);
                  U.sd("/dev/tty", U.Yc(5, 0));
                  U.sd("/dev/tty1", U.Yc(6, 0));
                  var a = Na();
                  U.Uc("/dev", "random", a);
                  U.Uc("/dev", "urandom", a);
                  U.mkdir("/dev/shm");
                  U.mkdir("/dev/shm/tmp");
              }
              ,
              ue: ()=>{
                  U.mkdir("/proc");
                  var a = U.mkdir("/proc/self");
                  U.mkdir("/proc/self/fd");
                  U.Hc({
                      Hc: ()=>{
                          var b = U.createNode(a, "fd", 16895, 73);
                          b.Cc = {
                              lookup: (d,f)=>{
                                  var g = U.Wc(+f);
                                  if (!g)
                                      throw new U.Bc(8);
                                  d = {
                                      parent: null,
                                      Hc: {
                                          fe: "fake"
                                      },
                                      Cc: {
                                          readlink: ()=>g.path
                                      }
                                  };
                                  return d.parent = d
                              }
                          };
                          return b
                      }
                  }, {}, "/proc/self/fd");
              }
              ,
              ve: ()=>{
                  c.stdin ? U.Uc("/dev", "stdin", c.stdin) : U.symlink("/dev/tty", "/dev/stdin");
                  c.stdout ? U.Uc("/dev", "stdout", null, c.stdout) : U.symlink("/dev/tty", "/dev/stdout");
                  c.stderr ? U.Uc("/dev", "stderr", null, c.stderr) : U.symlink("/dev/tty1", "/dev/stderr");
                  U.open("/dev/stdin", 0);
                  U.open("/dev/stdout", 1);
                  U.open("/dev/stderr", 1);
              }
              ,
              Xd: ()=>{
                  U.Bc || (U.Bc = function(a, b) {
                      this.node = b;
                      this.Le = function(d) {
                          this.Ic = d;
                      }
                      ;
                      this.Le(a);
                      this.message = "FS error";
                  }
                  ,
                  U.Bc.prototype = Error(),
                  U.Bc.prototype.constructor = U.Bc,
                  [44].forEach(a=>{
                      U.Bd[a] = new U.Bc(a);
                      U.Bd[a].stack = "<generic error, no stack>";
                  }
                  ));
              }
              ,
              Me: ()=>{
                  U.Xd();
                  U.Oc = Array(4096);
                  U.Hc(V, {}, "/");
                  U.se();
                  U.re();
                  U.ue();
                  U.xe = {
                      MEMFS: V
                  };
              }
              ,
              od: (a,b,d)=>{
                  U.od.Fd = !0;
                  U.Xd();
                  c.stdin = a || c.stdin;
                  c.stdout = b || c.stdout;
                  c.stderr = d || c.stderr;
                  U.ve();
              }
              ,
              ff: ()=>{
                  U.od.Fd = !1;
                  for (var a = 0; a < U.streams.length; a++) {
                      var b = U.streams[a];
                      b && U.close(b);
                  }
              }
              ,
              Cd: (a,b)=>{
                  var d = 0;
                  a && (d |= 365);
                  b && (d |= 146);
                  return d
              }
              ,
              We: (a,b)=>{
                  a = U.wd(a, b);
                  return a.exists ? a.object : null
              }
              ,
              wd: (a,b)=>{
                  try {
                      var d = U.Fc(a, {
                          Lc: !b
                      });
                      a = d.path;
                  } catch (g) {}
                  var f = {
                      qd: !1,
                      exists: !1,
                      error: 0,
                      name: null,
                      path: null,
                      object: null,
                      He: !1,
                      Je: null,
                      Ie: null
                  };
                  try {
                      d = U.Fc(a, {
                          parent: !0
                      }),
                      f.He = !0,
                      f.Je = d.path,
                      f.Ie = d.node,
                      f.name = S(a),
                      d = U.Fc(a, {
                          Lc: !b
                      }),
                      f.exists = !0,
                      f.path = d.path,
                      f.object = d.node,
                      f.name = d.node.name,
                      f.qd = "/" === d.path;
                  } catch (g) {
                      f.error = g.Ic;
                  }
                  return f
              }
              ,
              Ue: (a,b)=>{
                  a = "string" == typeof a ? a : U.Vc(a);
                  for (b = b.split("/").reverse(); b.length; ) {
                      var d = b.pop();
                      if (d) {
                          var f = R(a + "/" + d);
                          try {
                              U.mkdir(f);
                          } catch (g) {}
                          a = f;
                      }
                  }
                  return f
              }
              ,
              te: (a,b,d,f,g)=>{
                  a = "string" == typeof a ? a : U.Vc(a);
                  b = R(a + "/" + b);
                  return U.create(b, U.Cd(f, g))
              }
              ,
              Ud: (a,b,d,f,g,h)=>{
                  var l = b;
                  a && (a = "string" == typeof a ? a : U.Vc(a),
                  l = b ? R(a + "/" + b) : a);
                  a = U.Cd(f, g);
                  l = U.create(l, a);
                  if (d) {
                      if ("string" == typeof d) {
                          b = Array(d.length);
                          f = 0;
                          for (g = d.length; f < g; ++f)
                              b[f] = d.charCodeAt(f);
                          d = b;
                      }
                      U.chmod(l, a | 146);
                      b = U.open(l, 577);
                      U.write(b, d, 0, d.length, 0, h);
                      U.close(b);
                      U.chmod(l, a);
                  }
                  return l
              }
              ,
              Uc: (a,b,d,f)=>{
                  a = Ma("string" == typeof a ? a : U.Vc(a), b);
                  b = U.Cd(!!d, !!f);
                  U.Uc.Jd || (U.Uc.Jd = 64);
                  var g = U.Yc(U.Uc.Jd++, 0);
                  U.Od(g, {
                      open: h=>{
                          h.seekable = !1;
                      }
                      ,
                      close: ()=>{
                          f && f.buffer && f.buffer.length && f(10);
                      }
                      ,
                      read: (h,l,p,r)=>{
                          for (var m = 0, q = 0; q < r; q++) {
                              try {
                                  var w = d();
                              } catch (y) {
                                  throw new U.Bc(29);
                              }
                              if (void 0 === w && 0 === m)
                                  throw new U.Bc(6);
                              if (null === w || void 0 === w)
                                  break;
                              m++;
                              l[p + q] = w;
                          }
                          m && (h.node.timestamp = Date.now());
                          return m
                      }
                      ,
                      write: (h,l,p,r)=>{
                          for (var m = 0; m < r; m++)
                              try {
                                  f(l[p + m]);
                              } catch (q) {
                                  throw new U.Bc(29);
                              }
                          r && (h.node.timestamp = Date.now());
                          return m
                      }
                  });
                  return U.sd(a, b, g)
              }
              ,
              Ad: a=>{
                  if (a.Hd || a.Be || a.link || a.Dc)
                      return !0;
                  if ("undefined" != typeof XMLHttpRequest)
                      throw Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
                  if (x)
                      try {
                          a.Dc = Pa(x(a.url), !0),
                          a.Gc = a.Dc.length;
                      } catch (b) {
                          throw new U.Bc(29);
                      }
                  else
                      throw Error("Cannot load without read() or XMLHttpRequest.");
              }
              ,
              Te: (a,b,d,f,g)=>{
                  function h() {
                      this.Id = !1;
                      this.Rc = [];
                  }
                  h.prototype.get = function(m) {
                      if (!(m > this.length - 1 || 0 > m)) {
                          var q = m % this.chunkSize;
                          return this.be(m / this.chunkSize | 0)[q]
                      }
                  }
                  ;
                  h.prototype.he = function(m) {
                      this.be = m;
                  }
                  ;
                  h.prototype.Sd = function() {
                      var m = new XMLHttpRequest;
                      m.open("HEAD", d, !1);
                      m.send(null);
                      if (!(200 <= m.status && 300 > m.status || 304 === m.status))
                          throw Error("Couldn't load " + d + ". Status: " + m.status);
                      var q = Number(m.getResponseHeader("Content-length")), w, y = (w = m.getResponseHeader("Accept-Ranges")) && "bytes" === w;
                      m = (w = m.getResponseHeader("Content-Encoding")) && "gzip" === w;
                      var k = 1048576;
                      y || (k = q);
                      var t = this;
                      t.he(v=>{
                          var C = v * k
                            , L = (v + 1) * k - 1;
                          L = Math.min(L, q - 1);
                          if ("undefined" == typeof t.Rc[v]) {
                              var qb = t.Rc;
                              if (C > L)
                                  throw Error("invalid range (" + C + ", " + L + ") or no bytes requested!");
                              if (L > q - 1)
                                  throw Error("only " + q + " bytes available! programmer error!");
                              var D = new XMLHttpRequest;
                              D.open("GET", d, !1);
                              q !== k && D.setRequestHeader("Range", "bytes=" + C + "-" + L);
                              D.responseType = "arraybuffer";
                              D.overrideMimeType && D.overrideMimeType("text/plain; charset=x-user-defined");
                              D.send(null);
                              if (!(200 <= D.status && 300 > D.status || 304 === D.status))
                                  throw Error("Couldn't load " + d + ". Status: " + D.status);
                              C = void 0 !== D.response ? new Uint8Array(D.response || []) : Pa(D.responseText || "", !0);
                              qb[v] = C;
                          }
                          if ("undefined" == typeof t.Rc[v])
                              throw Error("doXHR failed!");
                          return t.Rc[v]
                      }
                      );
                      if (m || !q)
                          k = q = 1,
                          k = q = this.be(0).length,
                          la("LazyFiles on gzip forces download of the whole file when length is accessed");
                      this.le = q;
                      this.ke = k;
                      this.Id = !0;
                  }
                  ;
                  if ("undefined" != typeof XMLHttpRequest) {
                      if (!e)
                          throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                      var l = new h;
                      Object.defineProperties(l, {
                          length: {
                              get: function() {
                                  this.Id || this.Sd();
                                  return this.le
                              }
                          },
                          chunkSize: {
                              get: function() {
                                  this.Id || this.Sd();
                                  return this.ke
                              }
                          }
                      });
                      l = {
                          Hd: !1,
                          Dc: l
                      };
                  } else
                      l = {
                          Hd: !1,
                          url: d
                      };
                  var p = U.te(a, b, l, f, g);
                  l.Dc ? p.Dc = l.Dc : l.url && (p.Dc = null,
                  p.url = l.url);
                  Object.defineProperties(p, {
                      Gc: {
                          get: function() {
                              return this.Dc.length
                          }
                      }
                  });
                  var r = {};
                  Object.keys(p.Ec).forEach(m=>{
                      var q = p.Ec[m];
                      r[m] = function() {
                          U.Ad(p);
                          return q.apply(null, arguments)
                      }
                      ;
                  }
                  );
                  r.read = (m,q,w,y,k)=>{
                      U.Ad(p);
                      m = m.node.Dc;
                      if (k >= m.length)
                          q = 0;
                      else {
                          y = Math.min(m.length - k, y);
                          if (m.slice)
                              for (var t = 0; t < y; t++)
                                  q[w + t] = m[k + t];
                          else
                              for (t = 0; t < y; t++)
                                  q[w + t] = m.get(k + t);
                          q = y;
                      }
                      return q
                  }
                  ;
                  r.cd = ()=>{
                      U.Ad(p);
                      E();
                      throw new U.Bc(48);
                  }
                  ;
                  p.Ec = r;
                  return p
              }
              ,
              Ve: (a,b,d,f,g,h,l,p,r,m)=>{
                  function q(y) {
                      function k(t) {
                          m && m();
                          p || U.Ud(a, b, t, f, g, r);
                          h && h();
                          Ea();
                      }
                      Wa.Ze(y, w, k, ()=>{
                          l && l();
                          Ea();
                      }
                      ) || k(y);
                  }
                  var w = b ? T(R(a + "/" + b)) : a;
                  Da();
                  "string" == typeof d ? Va(d, y=>q(y), l) : q(d);
              }
              ,
              indexedDB: ()=>window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
              Qd: ()=>"EM_FS_" + window.location.pathname,
              Rd: 20,
              ed: "FILE_DATA",
              gf: (a,b,d)=>{
                  b = b || (()=>{}
                  );
                  d = d || (()=>{}
                  );
                  var f = U.indexedDB();
                  try {
                      var g = f.open(U.Qd(), U.Rd);
                  } catch (h) {
                      return d(h)
                  }
                  g.onupgradeneeded = ()=>{
                      la("creating db");
                      g.result.createObjectStore(U.ed);
                  }
                  ;
                  g.onsuccess = ()=>{
                      var h = g.result.transaction([U.ed], "readwrite")
                        , l = h.objectStore(U.ed)
                        , p = 0
                        , r = 0
                        , m = a.length;
                      a.forEach(q=>{
                          q = l.put(U.wd(q).object.Dc, q);
                          q.onsuccess = ()=>{
                              p++;
                              p + r == m && (0 == r ? b() : d());
                          }
                          ;
                          q.onerror = ()=>{
                              r++;
                              p + r == m && (0 == r ? b() : d());
                          }
                          ;
                      }
                      );
                      h.onerror = d;
                  }
                  ;
                  g.onerror = d;
              }
              ,
              $e: (a,b,d)=>{
                  b = b || (()=>{}
                  );
                  d = d || (()=>{}
                  );
                  var f = U.indexedDB();
                  try {
                      var g = f.open(U.Qd(), U.Rd);
                  } catch (h) {
                      return d(h)
                  }
                  g.onupgradeneeded = d;
                  g.onsuccess = ()=>{
                      var h = g.result;
                      try {
                          var l = h.transaction([U.ed], "readonly");
                      } catch (w) {
                          d(w);
                          return
                      }
                      var p = l.objectStore(U.ed)
                        , r = 0
                        , m = 0
                        , q = a.length;
                      a.forEach(w=>{
                          var y = p.get(w);
                          y.onsuccess = ()=>{
                              U.wd(w).exists && U.unlink(w);
                              U.Ud(La(w), S(w), y.result, !0, !0, !0);
                              r++;
                              r + m == q && (0 == m ? b() : d());
                          }
                          ;
                          y.onerror = ()=>{
                              m++;
                              r + m == q && (0 == m ? b() : d());
                          }
                          ;
                      }
                      );
                      l.onerror = d;
                  }
                  ;
                  g.onerror = d;
              }
          };
          function Xa(a, b) {
              if ("/" === b.charAt(0))
                  return b;
              if (-100 === a)
                  a = U.cwd();
              else {
                  a = U.Wc(a);
                  if (!a)
                      throw new U.Bc(8);
                  a = a.path;
              }
              if (0 == b.length)
                  throw new U.Bc(44);
              return R(a + "/" + b)
          }
          var Ya = void 0;
          function W() {
              Ya += 4;
              return J[Ya - 4 >> 2]
          }
          function X(a) {
              a = U.Wc(a);
              if (!a)
                  throw new U.Bc(8);
              return a
          }
          function Za(a) {
              var b = ra(a) + 1
                , d = $a(b);
              d && qa(a, I, d, b);
              return d
          }
          function ab(a, b, d) {
              function f(r) {
                  return (r = r.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? r[1] : "GMT"
              }
              var g = (new Date).getFullYear()
                , h = new Date(g,0,1)
                , l = new Date(g,6,1);
              g = h.getTimezoneOffset();
              var p = l.getTimezoneOffset();
              J[a >> 2] = 60 * Math.max(g, p);
              J[b >> 2] = Number(g != p);
              a = f(h);
              b = f(l);
              a = Za(a);
              b = Za(b);
              p < g ? (K[d >> 2] = a,
              K[d + 4 >> 2] = b) : (K[d >> 2] = b,
              K[d + 4 >> 2] = a);
          }
          function bb(a, b, d) {
              bb.ne || (bb.ne = !0,
              ab(a, b, d));
          }
          var cb = {};
          function db() {
              if (!eb) {
                  var a = {
                      USER: "web_user",
                      LOGNAME: "web_user",
                      PATH: "/",
                      PWD: "/",
                      HOME: "/home/web_user",
                      LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
                      _: da || "./this.program"
                  }, b;
                  for (b in cb)
                      void 0 === cb[b] ? delete a[b] : a[b] = cb[b];
                  var d = [];
                  for (b in a)
                      d.push(b + "=" + a[b]);
                  eb = d;
              }
              return eb
          }
          var eb;
          function fb(a) {
              return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400)
          }
          var gb = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            , hb = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            , Y = [];
          function ib(a) {
              var b = Y[a];
              b || (a >= Y.length && (Y.length = a + 1),
              Y[a] = b = M.get(a));
              return b
          }
          function jb(a, b, d, f) {
              var g = {
                  string: function(m) {
                      var q = 0;
                      if (null !== m && void 0 !== m && 0 !== m) {
                          var w = (m.length << 2) + 1;
                          q = kb(w);
                          qa(m, H, q, w);
                      }
                      return q
                  },
                  array: function(m) {
                      var q = kb(m.length);
                      I.set(m, q);
                      return q
                  }
              };
              a = c["_" + a];
              var h = []
                , l = 0;
              if (f)
                  for (var p = 0; p < f.length; p++) {
                      var r = g[d[p]];
                      r ? (0 === l && (l = lb()),
                      h[p] = r(f[p])) : h[p] = f[p];
                  }
              d = a.apply(null, h);
              return d = function(m) {
                  0 !== l && mb(l);
                  return "string" === b ? G(m) : "boolean" === b ? !!m : m
              }(d)
          }
          var Z = void 0
            , nb = [];
          function ob(a, b, d, f) {
              a || (a = this);
              this.parent = a;
              this.Hc = a.Hc;
              this.kd = null;
              this.id = U.Fe++;
              this.name = b;
              this.mode = d;
              this.Cc = {};
              this.Ec = {};
              this.rdev = f;
          }
          Object.defineProperties(ob.prototype, {
              read: {
                  get: function() {
                      return 365 === (this.mode & 365)
                  },
                  set: function(a) {
                      a ? this.mode |= 365 : this.mode &= -366;
                  }
              },
              write: {
                  get: function() {
                      return 146 === (this.mode & 146)
                  },
                  set: function(a) {
                      a ? this.mode |= 146 : this.mode &= -147;
                  }
              },
              Be: {
                  get: function() {
                      return U.Jc(this.mode)
                  }
              },
              Hd: {
                  get: function() {
                      return U.pd(this.mode)
                  }
              }
          });
          U.ie = ob;
          U.Me();
          var Wa, sb = {
              w: function(a, b) {
                  try {
                      var d = X(a);
                      if (d.fd === b)
                          return -28;
                      var f = U.Wc(b);
                      f && U.close(f);
                      return U.xd(d, b, b + 1).fd
                  } catch (g) {
                      if ("undefined" == typeof U || !(g instanceof U.Bc))
                          throw g;
                      return -g.Ic
                  }
              },
              d: function(a, b, d) {
                  Ya = d;
                  try {
                      var f = X(a);
                      switch (b) {
                      case 0:
                          var g = W();
                          return 0 > g ? -28 : U.xd(f, g).fd;
                      case 1:
                      case 2:
                          return 0;
                      case 3:
                          return f.flags;
                      case 4:
                          return g = W(),
                          f.flags |= g,
                          0;
                      case 5:
                          return g = W(),
                          ta[g + 0 >> 1] = 2,
                          0;
                      case 6:
                      case 7:
                          return 0;
                      case 16:
                      case 8:
                          return -28;
                      case 9:
                          return J[pb() >> 2] = 28,
                          -1;
                      default:
                          return -28
                      }
                  } catch (h) {
                      if ("undefined" == typeof U || !(h instanceof U.Bc))
                          throw h;
                      return -h.Ic
                  }
              },
              z: function(a, b, d) {
                  Ya = d;
                  try {
                      var f = X(a);
                      switch (b) {
                      case 21509:
                      case 21505:
                          return f.tty ? 0 : -59;
                      case 21510:
                      case 21511:
                      case 21512:
                      case 21506:
                      case 21507:
                      case 21508:
                          return f.tty ? 0 : -59;
                      case 21519:
                          if (!f.tty)
                              return -59;
                          var g = W();
                          return J[g >> 2] = 0;
                      case 21520:
                          return f.tty ? -28 : -59;
                      case 21531:
                          return g = W(),
                          U.Gd(f, b, g);
                      case 21523:
                          return f.tty ? 0 : -59;
                      case 21524:
                          return f.tty ? 0 : -59;
                      default:
                          E("bad ioctl syscall " + b);
                      }
                  } catch (h) {
                      if ("undefined" == typeof U || !(h instanceof U.Bc))
                          throw h;
                      return -h.Ic
                  }
              },
              r: function(a, b) {
                  try {
                      a = G(a);
                      a: {
                          var d = U.lstat;
                          try {
                              var f = d(a);
                          } catch (h) {
                              if (h && h.node && R(a) !== R(U.Vc(h.node))) {
                                  var g = -54;
                                  break a
                              }
                              throw h;
                          }
                          J[b >> 2] = f.dev;
                          J[b + 4 >> 2] = 0;
                          J[b + 8 >> 2] = f.ino;
                          J[b + 12 >> 2] = f.mode;
                          J[b + 16 >> 2] = f.nlink;
                          J[b + 20 >> 2] = f.uid;
                          J[b + 24 >> 2] = f.gid;
                          J[b + 28 >> 2] = f.rdev;
                          J[b + 32 >> 2] = 0;
                          Q = [f.size >>> 0, (P = f.size,
                          1 <= +Math.abs(P) ? 0 < P ? (Math.min(+Math.floor(P / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((P - +(~~P >>> 0)) / 4294967296) >>> 0 : 0)];
                          J[b + 40 >> 2] = Q[0];
                          J[b + 44 >> 2] = Q[1];
                          J[b + 48 >> 2] = 4096;
                          J[b + 52 >> 2] = f.blocks;
                          J[b + 56 >> 2] = f.atime.getTime() / 1E3 | 0;
                          J[b + 64 >> 2] = 0;
                          J[b + 72 >> 2] = f.mtime.getTime() / 1E3 | 0;
                          J[b + 80 >> 2] = 0;
                          J[b + 88 >> 2] = f.ctime.getTime() / 1E3 | 0;
                          J[b + 96 >> 2] = 0;
                          Q = [f.ino >>> 0, (P = f.ino,
                          1 <= +Math.abs(P) ? 0 < P ? (Math.min(+Math.floor(P / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((P - +(~~P >>> 0)) / 4294967296) >>> 0 : 0)];
                          J[b + 104 >> 2] = Q[0];
                          J[b + 108 >> 2] = Q[1];
                          g = 0;
                      }
                      return g
                  } catch (h) {
                      if ("undefined" == typeof U || !(h instanceof U.Bc))
                          throw h;
                      return -h.Ic
                  }
              },
              g: function(a, b, d, f) {
                  Ya = f;
                  try {
                      b = G(b);
                      b = Xa(a, b);
                      var g = f ? W() : 0;
                      return U.open(b, d, g).fd
                  } catch (h) {
                      if ("undefined" == typeof U || !(h instanceof U.Bc))
                          throw h;
                      return -h.Ic
                  }
              },
              s: function(a, b, d, f) {
                  try {
                      return b = G(b),
                      f = G(f),
                      b = Xa(a, b),
                      f = Xa(d, f),
                      U.rename(b, f),
                      0
                  } catch (g) {
                      if ("undefined" == typeof U || !(g instanceof U.Bc))
                          throw g;
                      return -g.Ic
                  }
              },
              t: function(a) {
                  try {
                      return a = G(a),
                      U.rmdir(a),
                      0
                  } catch (b) {
                      if ("undefined" == typeof U || !(b instanceof U.Bc))
                          throw b;
                      return -b.Ic
                  }
              },
              e: function(a, b, d) {
                  try {
                      return b = G(b),
                      b = Xa(a, b),
                      0 === d ? U.unlink(b) : 512 === d ? U.rmdir(b) : E("Invalid flags passed to unlinkat"),
                      0
                  } catch (f) {
                      if ("undefined" == typeof U || !(f instanceof U.Bc))
                          throw f;
                      return -f.Ic
                  }
              },
              a: function() {
                  return Date.now()
              },
              A: function() {
                  return !0
              },
              p: function() {
                  throw Infinity;
              },
              B: function(a, b) {
                  a = new Date(1E3 * J[a >> 2]);
                  J[b >> 2] = a.getUTCSeconds();
                  J[b + 4 >> 2] = a.getUTCMinutes();
                  J[b + 8 >> 2] = a.getUTCHours();
                  J[b + 12 >> 2] = a.getUTCDate();
                  J[b + 16 >> 2] = a.getUTCMonth();
                  J[b + 20 >> 2] = a.getUTCFullYear() - 1900;
                  J[b + 24 >> 2] = a.getUTCDay();
                  J[b + 28 >> 2] = (a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864E5 | 0;
              },
              C: function(a, b) {
                  a = new Date(1E3 * J[a >> 2]);
                  J[b >> 2] = a.getSeconds();
                  J[b + 4 >> 2] = a.getMinutes();
                  J[b + 8 >> 2] = a.getHours();
                  J[b + 12 >> 2] = a.getDate();
                  J[b + 16 >> 2] = a.getMonth();
                  J[b + 20 >> 2] = a.getFullYear() - 1900;
                  J[b + 24 >> 2] = a.getDay();
                  var d = new Date(a.getFullYear(),0,1);
                  J[b + 28 >> 2] = (a.getTime() - d.getTime()) / 864E5 | 0;
                  J[b + 36 >> 2] = -(60 * a.getTimezoneOffset());
                  var f = (new Date(a.getFullYear(),6,1)).getTimezoneOffset();
                  d = d.getTimezoneOffset();
                  J[b + 32 >> 2] = (f != d && a.getTimezoneOffset() == Math.min(d, f)) | 0;
              },
              i: function(a) {
                  var b = new Date(J[a + 20 >> 2] + 1900,J[a + 16 >> 2],J[a + 12 >> 2],J[a + 8 >> 2],J[a + 4 >> 2],J[a >> 2],0)
                    , d = J[a + 32 >> 2]
                    , f = b.getTimezoneOffset()
                    , g = new Date(b.getFullYear(),0,1)
                    , h = (new Date(b.getFullYear(),6,1)).getTimezoneOffset()
                    , l = g.getTimezoneOffset()
                    , p = Math.min(l, h);
                  0 > d ? J[a + 32 >> 2] = Number(h != l && p == f) : 0 < d != (p == f) && (h = Math.max(l, h),
                  b.setTime(b.getTime() + 6E4 * ((0 < d ? p : h) - f)));
                  J[a + 24 >> 2] = b.getDay();
                  J[a + 28 >> 2] = (b.getTime() - g.getTime()) / 864E5 | 0;
                  J[a >> 2] = b.getSeconds();
                  J[a + 4 >> 2] = b.getMinutes();
                  J[a + 8 >> 2] = b.getHours();
                  J[a + 12 >> 2] = b.getDate();
                  J[a + 16 >> 2] = b.getMonth();
                  return b.getTime() / 1E3 | 0
              },
              j: bb,
              D: function() {
                  E("");
              },
              k: function(a, b, d) {
                  H.copyWithin(a, b, b + d);
              },
              q: function(a) {
                  var b = H.length;
                  a >>>= 0;
                  if (2147483648 < a)
                      return !1;
                  for (var d = 1; 4 >= d; d *= 2) {
                      var f = b * (1 + .2 / d);
                      f = Math.min(f, a + 100663296);
                      var g = Math;
                      f = Math.max(a, f);
                      g = g.min.call(g, 2147483648, f + (65536 - f % 65536) % 65536);
                      a: {
                          try {
                              na.grow(g - sa.byteLength + 65535 >>> 16);
                              wa();
                              var h = 1;
                              break a
                          } catch (l) {}
                          h = void 0;
                      }
                      if (h)
                          return !0
                  }
                  return !1
              },
              u: function(a, b) {
                  var d = 0;
                  db().forEach(function(f, g) {
                      var h = b + d;
                      g = K[a + 4 * g >> 2] = h;
                      for (h = 0; h < f.length; ++h)
                          I[g++ >> 0] = f.charCodeAt(h);
                      I[g >> 0] = 0;
                      d += f.length + 1;
                  });
                  return 0
              },
              v: function(a, b) {
                  var d = db();
                  K[a >> 2] = d.length;
                  var f = 0;
                  d.forEach(function(g) {
                      f += g.length + 1;
                  });
                  K[b >> 2] = f;
                  return 0
              },
              l: function(a) {
                  if (!noExitRuntime) {
                      if (c.onExit)
                          c.onExit(a);
                      oa = !0;
                  }
                  ea(a, new ka(a));
              },
              c: function(a) {
                  try {
                      var b = X(a);
                      U.close(b);
                      return 0
                  } catch (d) {
                      if ("undefined" == typeof U || !(d instanceof U.Bc))
                          throw d;
                      return d.Ic
                  }
              },
              y: function(a, b, d, f) {
                  try {
                      a: {
                          var g = X(a);
                          a = b;
                          for (var h = b = 0; h < d; h++) {
                              var l = K[a >> 2]
                                , p = K[a + 4 >> 2];
                              a += 8;
                              var r = U.read(g, I, l, p, void 0);
                              if (0 > r) {
                                  var m = -1;
                                  break a
                              }
                              b += r;
                              if (r < p)
                                  break
                          }
                          m = b;
                      }
                      J[f >> 2] = m;
                      return 0
                  } catch (q) {
                      if ("undefined" == typeof U || !(q instanceof U.Bc))
                          throw q;
                      return q.Ic
                  }
              },
              o: function(a, b, d, f, g) {
                  try {
                      b = d + 2097152 >>> 0 < 4194305 - !!b ? (b >>> 0) + 4294967296 * d : NaN;
                      if (isNaN(b))
                          return 61;
                      var h = X(a);
                      U.Nc(h, b, f);
                      Q = [h.position >>> 0, (P = h.position,
                      1 <= +Math.abs(P) ? 0 < P ? (Math.min(+Math.floor(P / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((P - +(~~P >>> 0)) / 4294967296) >>> 0 : 0)];
                      J[g >> 2] = Q[0];
                      J[g + 4 >> 2] = Q[1];
                      h.Dd && 0 === b && 0 === f && (h.Dd = null);
                      return 0
                  } catch (l) {
                      if ("undefined" == typeof U || !(l instanceof U.Bc))
                          throw l;
                      return l.Ic
                  }
              },
              f: function(a, b, d, f) {
                  try {
                      a: {
                          var g = X(a);
                          a = b;
                          for (var h = b = 0; h < d; h++) {
                              var l = K[a >> 2]
                                , p = K[a + 4 >> 2];
                              a += 8;
                              var r = U.write(g, I, l, p, void 0);
                              if (0 > r) {
                                  var m = -1;
                                  break a
                              }
                              b += r;
                          }
                          m = b;
                      }
                      K[f >> 2] = m;
                      return 0
                  } catch (q) {
                      if ("undefined" == typeof U || !(q instanceof U.Bc))
                          throw q;
                      return q.Ic
                  }
              },
              h: function() {
                  return ma
              },
              x: rb,
              b: function(a) {
                  ma = a;
              },
              n: function(a, b, d, f) {
                  function g(k, t, v) {
                      for (k = "number" == typeof k ? k.toString() : k || ""; k.length < t; )
                          k = v[0] + k;
                      return k
                  }
                  function h(k, t) {
                      return g(k, t, "0")
                  }
                  function l(k, t) {
                      function v(L) {
                          return 0 > L ? -1 : 0 < L ? 1 : 0
                      }
                      var C;
                      0 === (C = v(k.getFullYear() - t.getFullYear())) && 0 === (C = v(k.getMonth() - t.getMonth())) && (C = v(k.getDate() - t.getDate()));
                      return C
                  }
                  function p(k) {
                      switch (k.getDay()) {
                      case 0:
                          return new Date(k.getFullYear() - 1,11,29);
                      case 1:
                          return k;
                      case 2:
                          return new Date(k.getFullYear(),0,3);
                      case 3:
                          return new Date(k.getFullYear(),0,2);
                      case 4:
                          return new Date(k.getFullYear(),0,1);
                      case 5:
                          return new Date(k.getFullYear() - 1,11,31);
                      case 6:
                          return new Date(k.getFullYear() - 1,11,30)
                      }
                  }
                  function r(k) {
                      var t = k.ad;
                      for (k = new Date((new Date(k.bd + 1900,0,1)).getTime()); 0 < t; ) {
                          var v = k.getMonth()
                            , C = (fb(k.getFullYear()) ? gb : hb)[v];
                          if (t > C - k.getDate())
                              t -= C - k.getDate() + 1,
                              k.setDate(1),
                              11 > v ? k.setMonth(v + 1) : (k.setMonth(0),
                              k.setFullYear(k.getFullYear() + 1));
                          else {
                              k.setDate(k.getDate() + t);
                              break
                          }
                      }
                      v = new Date(k.getFullYear() + 1,0,4);
                      t = p(new Date(k.getFullYear(),0,4));
                      v = p(v);
                      return 0 >= l(t, k) ? 0 >= l(v, k) ? k.getFullYear() + 1 : k.getFullYear() : k.getFullYear() - 1
                  }
                  var m = J[f + 40 >> 2];
                  f = {
                      Pe: J[f >> 2],
                      Oe: J[f + 4 >> 2],
                      ud: J[f + 8 >> 2],
                      Pd: J[f + 12 >> 2],
                      vd: J[f + 16 >> 2],
                      bd: J[f + 20 >> 2],
                      Qc: J[f + 24 >> 2],
                      ad: J[f + 28 >> 2],
                      kf: J[f + 32 >> 2],
                      Ne: J[f + 36 >> 2],
                      Qe: m ? G(m) : ""
                  };
                  d = G(d);
                  m = {
                      "%c": "%a %b %d %H:%M:%S %Y",
                      "%D": "%m/%d/%y",
                      "%F": "%Y-%m-%d",
                      "%h": "%b",
                      "%r": "%I:%M:%S %p",
                      "%R": "%H:%M",
                      "%T": "%H:%M:%S",
                      "%x": "%m/%d/%y",
                      "%X": "%H:%M:%S",
                      "%Ec": "%c",
                      "%EC": "%C",
                      "%Ex": "%m/%d/%y",
                      "%EX": "%H:%M:%S",
                      "%Ey": "%y",
                      "%EY": "%Y",
                      "%Od": "%d",
                      "%Oe": "%e",
                      "%OH": "%H",
                      "%OI": "%I",
                      "%Om": "%m",
                      "%OM": "%M",
                      "%OS": "%S",
                      "%Ou": "%u",
                      "%OU": "%U",
                      "%OV": "%V",
                      "%Ow": "%w",
                      "%OW": "%W",
                      "%Oy": "%y"
                  };
                  for (var q in m)
                      d = d.replace(new RegExp(q,"g"), m[q]);
                  var w = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ")
                    , y = "January February March April May June July August September October November December".split(" ");
                  m = {
                      "%a": function(k) {
                          return w[k.Qc].substring(0, 3)
                      },
                      "%A": function(k) {
                          return w[k.Qc]
                      },
                      "%b": function(k) {
                          return y[k.vd].substring(0, 3)
                      },
                      "%B": function(k) {
                          return y[k.vd]
                      },
                      "%C": function(k) {
                          return h((k.bd + 1900) / 100 | 0, 2)
                      },
                      "%d": function(k) {
                          return h(k.Pd, 2)
                      },
                      "%e": function(k) {
                          return g(k.Pd, 2, " ")
                      },
                      "%g": function(k) {
                          return r(k).toString().substring(2)
                      },
                      "%G": function(k) {
                          return r(k)
                      },
                      "%H": function(k) {
                          return h(k.ud, 2)
                      },
                      "%I": function(k) {
                          k = k.ud;
                          0 == k ? k = 12 : 12 < k && (k -= 12);
                          return h(k, 2)
                      },
                      "%j": function(k) {
                          for (var t = 0, v = 0; v <= k.vd - 1; t += (fb(k.bd + 1900) ? gb : hb)[v++])
                              ;
                          return h(k.Pd + t, 3)
                      },
                      "%m": function(k) {
                          return h(k.vd + 1, 2)
                      },
                      "%M": function(k) {
                          return h(k.Oe, 2)
                      },
                      "%n": function() {
                          return "\n"
                      },
                      "%p": function(k) {
                          return 0 <= k.ud && 12 > k.ud ? "AM" : "PM"
                      },
                      "%S": function(k) {
                          return h(k.Pe, 2)
                      },
                      "%t": function() {
                          return "\t"
                      },
                      "%u": function(k) {
                          return k.Qc || 7
                      },
                      "%U": function(k) {
                          return h(Math.floor((k.ad + 7 - k.Qc) / 7), 2)
                      },
                      "%V": function(k) {
                          var t = Math.floor((k.ad + 7 - (k.Qc + 6) % 7) / 7);
                          2 >= (k.Qc + 371 - k.ad - 2) % 7 && t++;
                          if (t)
                              53 == t && (v = (k.Qc + 371 - k.ad) % 7,
                              4 == v || 3 == v && fb(k.bd) || (t = 1));
                          else {
                              t = 52;
                              var v = (k.Qc + 7 - k.ad - 1) % 7;
                              (4 == v || 5 == v && fb(k.bd % 400 - 1)) && t++;
                          }
                          return h(t, 2)
                      },
                      "%w": function(k) {
                          return k.Qc
                      },
                      "%W": function(k) {
                          return h(Math.floor((k.ad + 7 - (k.Qc + 6) % 7) / 7), 2)
                      },
                      "%y": function(k) {
                          return (k.bd + 1900).toString().substring(2)
                      },
                      "%Y": function(k) {
                          return k.bd + 1900
                      },
                      "%z": function(k) {
                          k = k.Ne;
                          var t = 0 <= k;
                          k = Math.abs(k) / 60;
                          return (t ? "+" : "-") + String("0000" + (k / 60 * 100 + k % 60)).slice(-4)
                      },
                      "%Z": function(k) {
                          return k.Qe
                      },
                      "%%": function() {
                          return "%"
                      }
                  };
                  d = d.replace(/%%/g, "\x00\x00");
                  for (q in m)
                      d.includes(q) && (d = d.replace(new RegExp(q,"g"), m[q](f)));
                  d = d.replace(/\0\0/g, "%");
                  q = Pa(d, !1);
                  if (q.length > b)
                      return 0;
                  I.set(q, a);
                  return q.length - 1
              },
              m: function(a) {
                  if (n) {
                      if (!a)
                          return 1;
                      a = G(a);
                      if (!a.length)
                          return 0;
                      a = require("child_process").jf(a, [], {
                          hf: !0,
                          stdio: "inherit"
                      });
                      var b = (d,f)=>d << 8 | f;
                      return null === a.status ? b(0, (d=>{
                          switch (d) {
                          case "SIGHUP":
                              return 1;
                          case "SIGQUIT":
                              return 3;
                          case "SIGFPE":
                              return 8;
                          case "SIGKILL":
                              return 9;
                          case "SIGALRM":
                              return 14;
                          case "SIGTERM":
                              return 15
                          }
                          return 2
                      }
                      )(a.signal)) : a.status << 8 | 0
                  }
                  if (!a)
                      return 0;
                  J[pb() >> 2] = 52;
                  return -1
              }
          };
          (function() {
              function a(g) {
                  c.asm = g.exports;
                  na = c.asm.E;
                  wa();
                  M = c.asm.cb;
                  ya.unshift(c.asm.F);
                  Ea();
              }
              function b(g) {
                  a(g.instance);
              }
              function d(g) {
                  return Ia().then(function(h) {
                      return WebAssembly.instantiate(h, f)
                  }).then(function(h) {
                      return h
                  }).then(g, function(h) {
                      A("failed to asynchronously prepare wasm: " + h);
                      E(h);
                  })
              }
              var f = {
                  a: sb
              };
              Da();
              if (c.instantiateWasm)
                  try {
                      return c.instantiateWasm(f, a)
                  } catch (g) {
                      return A("Module.instantiateWasm callback failed with error: " + g),
                      !1
                  }
              (function() {
                  return B || "function" != typeof WebAssembly.instantiateStreaming || Fa() || O.startsWith("file://") || n || "function" != typeof fetch ? d(b) : fetch(O, {
                      credentials: "same-origin"
                  }).then(function(g) {
                      return WebAssembly.instantiateStreaming(g, f).then(b, function(h) {
                          A("wasm streaming compile failed: " + h);
                          A("falling back to ArrayBuffer instantiation");
                          return d(b)
                      })
                  })
              }
              )().catch(ba);
              return {}
          }
          )();
          c.___wasm_call_ctors = function() {
              return (c.___wasm_call_ctors = c.asm.F).apply(null, arguments)
          }
          ;
          c._lua_checkstack = function() {
              return (c._lua_checkstack = c.asm.G).apply(null, arguments)
          }
          ;
          c._lua_xmove = function() {
              return (c._lua_xmove = c.asm.H).apply(null, arguments)
          }
          ;
          c._lua_atpanic = function() {
              return (c._lua_atpanic = c.asm.I).apply(null, arguments)
          }
          ;
          c._lua_version = function() {
              return (c._lua_version = c.asm.J).apply(null, arguments)
          }
          ;
          c._lua_absindex = function() {
              return (c._lua_absindex = c.asm.K).apply(null, arguments)
          }
          ;
          c._lua_gettop = function() {
              return (c._lua_gettop = c.asm.L).apply(null, arguments)
          }
          ;
          c._lua_settop = function() {
              return (c._lua_settop = c.asm.M).apply(null, arguments)
          }
          ;
          c._lua_closeslot = function() {
              return (c._lua_closeslot = c.asm.N).apply(null, arguments)
          }
          ;
          c._lua_rotate = function() {
              return (c._lua_rotate = c.asm.O).apply(null, arguments)
          }
          ;
          c._lua_copy = function() {
              return (c._lua_copy = c.asm.P).apply(null, arguments)
          }
          ;
          c._lua_pushvalue = function() {
              return (c._lua_pushvalue = c.asm.Q).apply(null, arguments)
          }
          ;
          c._lua_type = function() {
              return (c._lua_type = c.asm.R).apply(null, arguments)
          }
          ;
          c._lua_typename = function() {
              return (c._lua_typename = c.asm.S).apply(null, arguments)
          }
          ;
          c._lua_iscfunction = function() {
              return (c._lua_iscfunction = c.asm.T).apply(null, arguments)
          }
          ;
          c._lua_isinteger = function() {
              return (c._lua_isinteger = c.asm.U).apply(null, arguments)
          }
          ;
          c._lua_isnumber = function() {
              return (c._lua_isnumber = c.asm.V).apply(null, arguments)
          }
          ;
          c._lua_isstring = function() {
              return (c._lua_isstring = c.asm.W).apply(null, arguments)
          }
          ;
          c._lua_isuserdata = function() {
              return (c._lua_isuserdata = c.asm.X).apply(null, arguments)
          }
          ;
          c._lua_rawequal = function() {
              return (c._lua_rawequal = c.asm.Y).apply(null, arguments)
          }
          ;
          c._lua_arith = function() {
              return (c._lua_arith = c.asm.Z).apply(null, arguments)
          }
          ;
          c._lua_compare = function() {
              return (c._lua_compare = c.asm._).apply(null, arguments)
          }
          ;
          c._lua_stringtonumber = function() {
              return (c._lua_stringtonumber = c.asm.$).apply(null, arguments)
          }
          ;
          c._lua_tonumberx = function() {
              return (c._lua_tonumberx = c.asm.aa).apply(null, arguments)
          }
          ;
          c._lua_tointegerx = function() {
              return (c._lua_tointegerx = c.asm.ba).apply(null, arguments)
          }
          ;
          c._lua_toboolean = function() {
              return (c._lua_toboolean = c.asm.ca).apply(null, arguments)
          }
          ;
          c._lua_tolstring = function() {
              return (c._lua_tolstring = c.asm.da).apply(null, arguments)
          }
          ;
          c._lua_rawlen = function() {
              return (c._lua_rawlen = c.asm.ea).apply(null, arguments)
          }
          ;
          c._lua_tocfunction = function() {
              return (c._lua_tocfunction = c.asm.fa).apply(null, arguments)
          }
          ;
          c._lua_touserdata = function() {
              return (c._lua_touserdata = c.asm.ga).apply(null, arguments)
          }
          ;
          c._lua_tothread = function() {
              return (c._lua_tothread = c.asm.ha).apply(null, arguments)
          }
          ;
          c._lua_topointer = function() {
              return (c._lua_topointer = c.asm.ia).apply(null, arguments)
          }
          ;
          c._lua_pushnil = function() {
              return (c._lua_pushnil = c.asm.ja).apply(null, arguments)
          }
          ;
          c._lua_pushnumber = function() {
              return (c._lua_pushnumber = c.asm.ka).apply(null, arguments)
          }
          ;
          c._lua_pushinteger = function() {
              return (c._lua_pushinteger = c.asm.la).apply(null, arguments)
          }
          ;
          c._lua_pushlstring = function() {
              return (c._lua_pushlstring = c.asm.ma).apply(null, arguments)
          }
          ;
          c._lua_pushstring = function() {
              return (c._lua_pushstring = c.asm.na).apply(null, arguments)
          }
          ;
          c._lua_pushcclosure = function() {
              return (c._lua_pushcclosure = c.asm.oa).apply(null, arguments)
          }
          ;
          c._lua_pushboolean = function() {
              return (c._lua_pushboolean = c.asm.pa).apply(null, arguments)
          }
          ;
          c._lua_pushlightuserdata = function() {
              return (c._lua_pushlightuserdata = c.asm.qa).apply(null, arguments)
          }
          ;
          c._lua_pushthread = function() {
              return (c._lua_pushthread = c.asm.ra).apply(null, arguments)
          }
          ;
          c._lua_getglobal = function() {
              return (c._lua_getglobal = c.asm.sa).apply(null, arguments)
          }
          ;
          c._lua_gettable = function() {
              return (c._lua_gettable = c.asm.ta).apply(null, arguments)
          }
          ;
          c._lua_getfield = function() {
              return (c._lua_getfield = c.asm.ua).apply(null, arguments)
          }
          ;
          c._lua_geti = function() {
              return (c._lua_geti = c.asm.va).apply(null, arguments)
          }
          ;
          c._lua_rawget = function() {
              return (c._lua_rawget = c.asm.wa).apply(null, arguments)
          }
          ;
          c._lua_rawgeti = function() {
              return (c._lua_rawgeti = c.asm.xa).apply(null, arguments)
          }
          ;
          c._lua_rawgetp = function() {
              return (c._lua_rawgetp = c.asm.ya).apply(null, arguments)
          }
          ;
          c._lua_createtable = function() {
              return (c._lua_createtable = c.asm.za).apply(null, arguments)
          }
          ;
          c._lua_getmetatable = function() {
              return (c._lua_getmetatable = c.asm.Aa).apply(null, arguments)
          }
          ;
          c._lua_getiuservalue = function() {
              return (c._lua_getiuservalue = c.asm.Ba).apply(null, arguments)
          }
          ;
          c._lua_setglobal = function() {
              return (c._lua_setglobal = c.asm.Ca).apply(null, arguments)
          }
          ;
          c._lua_settable = function() {
              return (c._lua_settable = c.asm.Da).apply(null, arguments)
          }
          ;
          c._lua_setfield = function() {
              return (c._lua_setfield = c.asm.Ea).apply(null, arguments)
          }
          ;
          c._lua_seti = function() {
              return (c._lua_seti = c.asm.Fa).apply(null, arguments)
          }
          ;
          c._lua_rawset = function() {
              return (c._lua_rawset = c.asm.Ga).apply(null, arguments)
          }
          ;
          c._lua_rawsetp = function() {
              return (c._lua_rawsetp = c.asm.Ha).apply(null, arguments)
          }
          ;
          c._lua_rawseti = function() {
              return (c._lua_rawseti = c.asm.Ia).apply(null, arguments)
          }
          ;
          c._lua_setmetatable = function() {
              return (c._lua_setmetatable = c.asm.Ja).apply(null, arguments)
          }
          ;
          c._lua_setiuservalue = function() {
              return (c._lua_setiuservalue = c.asm.Ka).apply(null, arguments)
          }
          ;
          c._lua_callk = function() {
              return (c._lua_callk = c.asm.La).apply(null, arguments)
          }
          ;
          c._lua_pcallk = function() {
              return (c._lua_pcallk = c.asm.Ma).apply(null, arguments)
          }
          ;
          c._lua_load = function() {
              return (c._lua_load = c.asm.Na).apply(null, arguments)
          }
          ;
          c._lua_dump = function() {
              return (c._lua_dump = c.asm.Oa).apply(null, arguments)
          }
          ;
          c._lua_status = function() {
              return (c._lua_status = c.asm.Pa).apply(null, arguments)
          }
          ;
          c._lua_error = function() {
              return (c._lua_error = c.asm.Qa).apply(null, arguments)
          }
          ;
          c._lua_next = function() {
              return (c._lua_next = c.asm.Ra).apply(null, arguments)
          }
          ;
          c._lua_toclose = function() {
              return (c._lua_toclose = c.asm.Sa).apply(null, arguments)
          }
          ;
          c._lua_concat = function() {
              return (c._lua_concat = c.asm.Ta).apply(null, arguments)
          }
          ;
          c._lua_len = function() {
              return (c._lua_len = c.asm.Ua).apply(null, arguments)
          }
          ;
          c._lua_getallocf = function() {
              return (c._lua_getallocf = c.asm.Va).apply(null, arguments)
          }
          ;
          c._lua_setallocf = function() {
              return (c._lua_setallocf = c.asm.Wa).apply(null, arguments)
          }
          ;
          c._lua_setwarnf = function() {
              return (c._lua_setwarnf = c.asm.Xa).apply(null, arguments)
          }
          ;
          c._lua_warning = function() {
              return (c._lua_warning = c.asm.Ya).apply(null, arguments)
          }
          ;
          c._lua_newuserdatauv = function() {
              return (c._lua_newuserdatauv = c.asm.Za).apply(null, arguments)
          }
          ;
          c._lua_getupvalue = function() {
              return (c._lua_getupvalue = c.asm._a).apply(null, arguments)
          }
          ;
          c._lua_setupvalue = function() {
              return (c._lua_setupvalue = c.asm.$a).apply(null, arguments)
          }
          ;
          c._lua_upvalueid = function() {
              return (c._lua_upvalueid = c.asm.ab).apply(null, arguments)
          }
          ;
          c._lua_upvaluejoin = function() {
              return (c._lua_upvaluejoin = c.asm.bb).apply(null, arguments)
          }
          ;
          c._luaL_traceback = function() {
              return (c._luaL_traceback = c.asm.db).apply(null, arguments)
          }
          ;
          c._lua_getstack = function() {
              return (c._lua_getstack = c.asm.eb).apply(null, arguments)
          }
          ;
          c._lua_getinfo = function() {
              return (c._lua_getinfo = c.asm.fb).apply(null, arguments)
          }
          ;
          c._luaL_buffinit = function() {
              return (c._luaL_buffinit = c.asm.gb).apply(null, arguments)
          }
          ;
          c._luaL_addstring = function() {
              return (c._luaL_addstring = c.asm.hb).apply(null, arguments)
          }
          ;
          c._luaL_prepbuffsize = function() {
              return (c._luaL_prepbuffsize = c.asm.ib).apply(null, arguments)
          }
          ;
          c._luaL_addvalue = function() {
              return (c._luaL_addvalue = c.asm.jb).apply(null, arguments)
          }
          ;
          c._luaL_pushresult = function() {
              return (c._luaL_pushresult = c.asm.kb).apply(null, arguments)
          }
          ;
          c._luaL_argerror = function() {
              return (c._luaL_argerror = c.asm.lb).apply(null, arguments)
          }
          ;
          c._luaL_typeerror = function() {
              return (c._luaL_typeerror = c.asm.mb).apply(null, arguments)
          }
          ;
          c._luaL_getmetafield = function() {
              return (c._luaL_getmetafield = c.asm.nb).apply(null, arguments)
          }
          ;
          c._luaL_where = function() {
              return (c._luaL_where = c.asm.ob).apply(null, arguments)
          }
          ;
          c._luaL_fileresult = function() {
              return (c._luaL_fileresult = c.asm.pb).apply(null, arguments)
          }
          ;
          var pb = c.___errno_location = function() {
              return (pb = c.___errno_location = c.asm.qb).apply(null, arguments)
          }
          ;
          c._luaL_execresult = function() {
              return (c._luaL_execresult = c.asm.rb).apply(null, arguments)
          }
          ;
          c._luaL_newmetatable = function() {
              return (c._luaL_newmetatable = c.asm.sb).apply(null, arguments)
          }
          ;
          c._luaL_setmetatable = function() {
              return (c._luaL_setmetatable = c.asm.tb).apply(null, arguments)
          }
          ;
          c._luaL_testudata = function() {
              return (c._luaL_testudata = c.asm.ub).apply(null, arguments)
          }
          ;
          c._luaL_checkudata = function() {
              return (c._luaL_checkudata = c.asm.vb).apply(null, arguments)
          }
          ;
          c._luaL_optlstring = function() {
              return (c._luaL_optlstring = c.asm.wb).apply(null, arguments)
          }
          ;
          c._luaL_checklstring = function() {
              return (c._luaL_checklstring = c.asm.xb).apply(null, arguments)
          }
          ;
          c._luaL_checkstack = function() {
              return (c._luaL_checkstack = c.asm.yb).apply(null, arguments)
          }
          ;
          c._luaL_checktype = function() {
              return (c._luaL_checktype = c.asm.zb).apply(null, arguments)
          }
          ;
          c._luaL_checkany = function() {
              return (c._luaL_checkany = c.asm.Ab).apply(null, arguments)
          }
          ;
          c._luaL_checknumber = function() {
              return (c._luaL_checknumber = c.asm.Bb).apply(null, arguments)
          }
          ;
          c._luaL_optnumber = function() {
              return (c._luaL_optnumber = c.asm.Cb).apply(null, arguments)
          }
          ;
          c._luaL_checkinteger = function() {
              return (c._luaL_checkinteger = c.asm.Db).apply(null, arguments)
          }
          ;
          c._luaL_optinteger = function() {
              return (c._luaL_optinteger = c.asm.Eb).apply(null, arguments)
          }
          ;
          c._luaL_setfuncs = function() {
              return (c._luaL_setfuncs = c.asm.Fb).apply(null, arguments)
          }
          ;
          c._luaL_addlstring = function() {
              return (c._luaL_addlstring = c.asm.Gb).apply(null, arguments)
          }
          ;
          c._luaL_pushresultsize = function() {
              return (c._luaL_pushresultsize = c.asm.Hb).apply(null, arguments)
          }
          ;
          c._luaL_buffinitsize = function() {
              return (c._luaL_buffinitsize = c.asm.Ib).apply(null, arguments)
          }
          ;
          c._luaL_ref = function() {
              return (c._luaL_ref = c.asm.Jb).apply(null, arguments)
          }
          ;
          c._luaL_unref = function() {
              return (c._luaL_unref = c.asm.Kb).apply(null, arguments)
          }
          ;
          c._luaL_loadfilex = function() {
              return (c._luaL_loadfilex = c.asm.Lb).apply(null, arguments)
          }
          ;
          c._luaL_loadbufferx = function() {
              return (c._luaL_loadbufferx = c.asm.Mb).apply(null, arguments)
          }
          ;
          c._luaL_loadstring = function() {
              return (c._luaL_loadstring = c.asm.Nb).apply(null, arguments)
          }
          ;
          c._luaL_callmeta = function() {
              return (c._luaL_callmeta = c.asm.Ob).apply(null, arguments)
          }
          ;
          c._luaL_len = function() {
              return (c._luaL_len = c.asm.Pb).apply(null, arguments)
          }
          ;
          c._luaL_tolstring = function() {
              return (c._luaL_tolstring = c.asm.Qb).apply(null, arguments)
          }
          ;
          c._luaL_getsubtable = function() {
              return (c._luaL_getsubtable = c.asm.Rb).apply(null, arguments)
          }
          ;
          c._luaL_requiref = function() {
              return (c._luaL_requiref = c.asm.Sb).apply(null, arguments)
          }
          ;
          c._luaL_addgsub = function() {
              return (c._luaL_addgsub = c.asm.Tb).apply(null, arguments)
          }
          ;
          c._luaL_gsub = function() {
              return (c._luaL_gsub = c.asm.Ub).apply(null, arguments)
          }
          ;
          c._luaL_newstate = function() {
              return (c._luaL_newstate = c.asm.Vb).apply(null, arguments)
          }
          ;
          c._lua_newstate = function() {
              return (c._lua_newstate = c.asm.Wb).apply(null, arguments)
          }
          ;
          c._free = function() {
              return (c._free = c.asm.Xb).apply(null, arguments)
          }
          ;
          c._realloc = function() {
              return (c._realloc = c.asm.Yb).apply(null, arguments)
          }
          ;
          c._luaL_checkversion_ = function() {
              return (c._luaL_checkversion_ = c.asm.Zb).apply(null, arguments)
          }
          ;
          c._luaopen_base = function() {
              return (c._luaopen_base = c.asm._b).apply(null, arguments)
          }
          ;
          c._luaopen_coroutine = function() {
              return (c._luaopen_coroutine = c.asm.$b).apply(null, arguments)
          }
          ;
          c._lua_newthread = function() {
              return (c._lua_newthread = c.asm.ac).apply(null, arguments)
          }
          ;
          c._lua_yieldk = function() {
              return (c._lua_yieldk = c.asm.bc).apply(null, arguments)
          }
          ;
          c._lua_isyieldable = function() {
              return (c._lua_isyieldable = c.asm.cc).apply(null, arguments)
          }
          ;
          c._lua_resetthread = function() {
              return (c._lua_resetthread = c.asm.dc).apply(null, arguments)
          }
          ;
          c._lua_resume = function() {
              return (c._lua_resume = c.asm.ec).apply(null, arguments)
          }
          ;
          c._luaopen_debug = function() {
              return (c._luaopen_debug = c.asm.fc).apply(null, arguments)
          }
          ;
          c._lua_gethookmask = function() {
              return (c._lua_gethookmask = c.asm.gc).apply(null, arguments)
          }
          ;
          c._lua_gethook = function() {
              return (c._lua_gethook = c.asm.hc).apply(null, arguments)
          }
          ;
          c._lua_gethookcount = function() {
              return (c._lua_gethookcount = c.asm.ic).apply(null, arguments)
          }
          ;
          c._lua_getlocal = function() {
              return (c._lua_getlocal = c.asm.jc).apply(null, arguments)
          }
          ;
          c._lua_sethook = function() {
              return (c._lua_sethook = c.asm.kc).apply(null, arguments)
          }
          ;
          c._lua_setlocal = function() {
              return (c._lua_setlocal = c.asm.lc).apply(null, arguments)
          }
          ;
          c._lua_setcstacklimit = function() {
              return (c._lua_setcstacklimit = c.asm.mc).apply(null, arguments)
          }
          ;
          var $a = c._malloc = function() {
              return ($a = c._malloc = c.asm.nc).apply(null, arguments)
          }
          ;
          c._luaL_openlibs = function() {
              return (c._luaL_openlibs = c.asm.oc).apply(null, arguments)
          }
          ;
          c._luaopen_package = function() {
              return (c._luaopen_package = c.asm.pc).apply(null, arguments)
          }
          ;
          c._luaopen_table = function() {
              return (c._luaopen_table = c.asm.qc).apply(null, arguments)
          }
          ;
          c._luaopen_io = function() {
              return (c._luaopen_io = c.asm.rc).apply(null, arguments)
          }
          ;
          c._luaopen_os = function() {
              return (c._luaopen_os = c.asm.sc).apply(null, arguments)
          }
          ;
          c._luaopen_string = function() {
              return (c._luaopen_string = c.asm.tc).apply(null, arguments)
          }
          ;
          c._luaopen_math = function() {
              return (c._luaopen_math = c.asm.uc).apply(null, arguments)
          }
          ;
          c._luaopen_utf8 = function() {
              return (c._luaopen_utf8 = c.asm.vc).apply(null, arguments)
          }
          ;
          c._lua_close = function() {
              return (c._lua_close = c.asm.wc).apply(null, arguments)
          }
          ;
          var tb = c._setThrew = function() {
              return (tb = c._setThrew = c.asm.xc).apply(null, arguments)
          }
            , lb = c.stackSave = function() {
              return (lb = c.stackSave = c.asm.yc).apply(null, arguments)
          }
            , mb = c.stackRestore = function() {
              return (mb = c.stackRestore = c.asm.zc).apply(null, arguments)
          }
            , kb = c.stackAlloc = function() {
              return (kb = c.stackAlloc = c.asm.Ac).apply(null, arguments)
          }
          ;
          function rb(a, b, d) {
              var f = lb();
              try {
                  ib(a)(b, d);
              } catch (g) {
                  mb(f);
                  if (g !== g + 0)
                      throw g;
                  tb(1, 0);
              }
          }
          c.ENV = cb;
          c.cwrap = function(a, b, d, f) {
              d = d || [];
              var g = d.every(h=>"number" === h);
              return "string" !== b && g && !f ? c["_" + a] : function() {
                  return jb(a, b, d, arguments)
              }
          }
          ;
          c.addFunction = function(a, b) {
              if (!Z) {
                  Z = new WeakMap;
                  var d = M.length;
                  if (Z)
                      for (var f = 0; f < 0 + d; f++) {
                          var g = ib(f);
                          g && Z.set(g, f);
                      }
              }
              if (Z.has(a))
                  return Z.get(a);
              if (nb.length)
                  d = nb.pop();
              else {
                  try {
                      M.grow(1);
                  } catch (p) {
                      if (!(p instanceof RangeError))
                          throw p;
                      throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
                  }
                  d = M.length - 1;
              }
              try {
                  f = d,
                  M.set(f, a),
                  Y[f] = M.get(f);
              } catch (p) {
                  if (!(p instanceof TypeError))
                      throw p;
                  if ("function" == typeof WebAssembly.Function) {
                      f = WebAssembly.Function;
                      g = {
                          i: "i32",
                          j: "i64",
                          f: "f32",
                          d: "f64",
                          p: "i32"
                      };
                      for (var h = {
                          parameters: [],
                          results: "v" == b[0] ? [] : [g[b[0]]]
                      }, l = 1; l < b.length; ++l)
                          h.parameters.push(g[b[l]]);
                      b = new f(h,a);
                  } else {
                      f = [1, 96];
                      g = b.slice(0, 1);
                      b = b.slice(1);
                      h = {
                          i: 127,
                          p: 127,
                          j: 126,
                          f: 125,
                          d: 124
                      };
                      l = b.length;
                      128 > l ? f.push(l) : f.push(l % 128 | 128, l >> 7);
                      for (l = 0; l < b.length; ++l)
                          f.push(h[b[l]]);
                      "v" == g ? f.push(0) : f.push(1, h[g]);
                      b = [0, 97, 115, 109, 1, 0, 0, 0, 1];
                      g = f.length;
                      128 > g ? b.push(g) : b.push(g % 128 | 128, g >> 7);
                      b.push.apply(b, f);
                      b.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
                      b = new WebAssembly.Module(new Uint8Array(b));
                      b = (new WebAssembly.Instance(b,{
                          e: {
                              f: a
                          }
                      })).exports.f;
                  }
                  f = d;
                  M.set(f, b);
                  Y[f] = M.get(f);
              }
              Z.set(a, d);
              return d
          }
          ;
          c.removeFunction = function(a) {
              Z.delete(ib(a));
              nb.push(a);
          }
          ;
          c.setValue = function(a, b, d="i8") {
              d.endsWith("*") && (d = "*");
              switch (d) {
              case "i1":
                  I[a >> 0] = b;
                  break;
              case "i8":
                  I[a >> 0] = b;
                  break;
              case "i16":
                  ta[a >> 1] = b;
                  break;
              case "i32":
                  J[a >> 2] = b;
                  break;
              case "i64":
                  Q = [b >>> 0, (P = b,
                  1 <= +Math.abs(P) ? 0 < P ? (Math.min(+Math.floor(P / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((P - +(~~P >>> 0)) / 4294967296) >>> 0 : 0)];
                  J[a >> 2] = Q[0];
                  J[a + 4 >> 2] = Q[1];
                  break;
              case "float":
                  ua[a >> 2] = b;
                  break;
              case "double":
                  va[a >> 3] = b;
                  break;
              case "*":
                  K[a >> 2] = b;
                  break;
              default:
                  E("invalid type for setValue: " + d);
              }
          }
          ;
          c.getValue = function(a, b="i8") {
              b.endsWith("*") && (b = "*");
              switch (b) {
              case "i1":
                  return I[a >> 0];
              case "i8":
                  return I[a >> 0];
              case "i16":
                  return ta[a >> 1];
              case "i32":
                  return J[a >> 2];
              case "i64":
                  return J[a >> 2];
              case "float":
                  return ua[a >> 2];
              case "double":
                  return va[a >> 3];
              case "*":
                  return K[a >> 2];
              default:
                  E("invalid type for getValue: " + b);
              }
              return null
          }
          ;
          c.FS = U;
          var ub;
          Ca = function vb() {
              ub || wb();
              ub || (Ca = vb);
          }
          ;
          function wb() {
              function a() {
                  if (!ub && (ub = !0,
                  c.calledRun = !0,
                  !oa)) {
                      c.noFSInit || U.od.Fd || U.od();
                      U.ee = !1;
                      Ja(ya);
                      aa(c);
                      if (c.onRuntimeInitialized)
                          c.onRuntimeInitialized();
                      if (c.postRun)
                          for ("function" == typeof c.postRun && (c.postRun = [c.postRun]); c.postRun.length; ) {
                              var b = c.postRun.shift();
                              za.unshift(b);
                          }
                      Ja(za);
                  }
              }
              if (!(0 < N)) {
                  if (c.preRun)
                      for ("function" == typeof c.preRun && (c.preRun = [c.preRun]); c.preRun.length; )
                          Aa();
                  Ja(xa);
                  0 < N || (c.setStatus ? (c.setStatus("Running..."),
                  setTimeout(function() {
                      setTimeout(function() {
                          c.setStatus("");
                      }, 1);
                      a();
                  }, 1)) : a());
              }
          }
          if (c.preInit)
              for ("function" == typeof c.preInit && (c.preInit = [c.preInit]); 0 < c.preInit.length; )
                  c.preInit.pop()();
          wb();

          return initWasmModule.ready
      }
      );
  }
  )();

  class LuaWasm {
      constructor(module) {
          this.referenceTracker = new WeakMap();
          this.referenceMap = new Map();
          this.availableReferences = [];
          this.module = module;
          this.luaL_checkversion_ = this.module.cwrap('luaL_checkversion_', null, ['number', 'number', 'number']);
          this.luaL_getmetafield = this.module.cwrap('luaL_getmetafield', 'number', ['number', 'number', 'string']);
          this.luaL_callmeta = this.module.cwrap('luaL_callmeta', 'number', ['number', 'number', 'string']);
          this.luaL_tolstring = this.module.cwrap('luaL_tolstring', 'string', ['number', 'number', 'number']);
          this.luaL_argerror = this.module.cwrap('luaL_argerror', 'number', ['number', 'number', 'string']);
          this.luaL_typeerror = this.module.cwrap('luaL_typeerror', 'number', ['number', 'number', 'string']);
          this.luaL_checklstring = this.module.cwrap('luaL_checklstring', 'string', ['number', 'number', 'number']);
          this.luaL_optlstring = this.module.cwrap('luaL_optlstring', 'string', ['number', 'number', 'string', 'number']);
          this.luaL_checknumber = this.module.cwrap('luaL_checknumber', 'number', ['number', 'number']);
          this.luaL_optnumber = this.module.cwrap('luaL_optnumber', 'number', ['number', 'number', 'number']);
          this.luaL_checkinteger = this.module.cwrap('luaL_checkinteger', 'number', ['number', 'number']);
          this.luaL_optinteger = this.module.cwrap('luaL_optinteger', 'number', ['number', 'number', 'number']);
          this.luaL_checkstack = this.module.cwrap('luaL_checkstack', null, ['number', 'number', 'string']);
          this.luaL_checktype = this.module.cwrap('luaL_checktype', null, ['number', 'number', 'number']);
          this.luaL_checkany = this.module.cwrap('luaL_checkany', null, ['number', 'number']);
          this.luaL_newmetatable = this.module.cwrap('luaL_newmetatable', 'number', ['number', 'string']);
          this.luaL_setmetatable = this.module.cwrap('luaL_setmetatable', null, ['number', 'string']);
          this.luaL_testudata = this.module.cwrap('luaL_testudata', 'number', ['number', 'number', 'string']);
          this.luaL_checkudata = this.module.cwrap('luaL_checkudata', 'number', ['number', 'number', 'string']);
          this.luaL_where = this.module.cwrap('luaL_where', null, ['number', 'number']);
          this.luaL_fileresult = this.module.cwrap('luaL_fileresult', 'number', ['number', 'number', 'string']);
          this.luaL_execresult = this.module.cwrap('luaL_execresult', 'number', ['number', 'number']);
          this.luaL_ref = this.module.cwrap('luaL_ref', 'number', ['number', 'number']);
          this.luaL_unref = this.module.cwrap('luaL_unref', null, ['number', 'number', 'number']);
          this.luaL_loadfilex = this.module.cwrap('luaL_loadfilex', 'number', ['number', 'string', 'string']);
          this.luaL_loadbufferx = this.module.cwrap('luaL_loadbufferx', 'number', ['number', 'string', 'number', 'string', 'string']);
          this.luaL_loadstring = this.module.cwrap('luaL_loadstring', 'number', ['number', 'string']);
          this.luaL_newstate = this.module.cwrap('luaL_newstate', 'number', []);
          this.luaL_len = this.module.cwrap('luaL_len', 'number', ['number', 'number']);
          this.luaL_addgsub = this.module.cwrap('luaL_addgsub', null, ['number', 'string', 'string', 'string']);
          this.luaL_gsub = this.module.cwrap('luaL_gsub', 'string', ['number', 'string', 'string', 'string']);
          this.luaL_setfuncs = this.module.cwrap('luaL_setfuncs', null, ['number', 'number', 'number']);
          this.luaL_getsubtable = this.module.cwrap('luaL_getsubtable', 'number', ['number', 'number', 'string']);
          this.luaL_traceback = this.module.cwrap('luaL_traceback', null, ['number', 'number', 'string', 'number']);
          this.luaL_requiref = this.module.cwrap('luaL_requiref', null, ['number', 'string', 'number', 'number']);
          this.luaL_buffinit = this.module.cwrap('luaL_buffinit', null, ['number', 'number']);
          this.luaL_prepbuffsize = this.module.cwrap('luaL_prepbuffsize', 'string', ['number', 'number']);
          this.luaL_addlstring = this.module.cwrap('luaL_addlstring', null, ['number', 'string', 'number']);
          this.luaL_addstring = this.module.cwrap('luaL_addstring', null, ['number', 'string']);
          this.luaL_addvalue = this.module.cwrap('luaL_addvalue', null, ['number']);
          this.luaL_pushresult = this.module.cwrap('luaL_pushresult', null, ['number']);
          this.luaL_pushresultsize = this.module.cwrap('luaL_pushresultsize', null, ['number', 'number']);
          this.luaL_buffinitsize = this.module.cwrap('luaL_buffinitsize', 'string', ['number', 'number', 'number']);
          this.lua_newstate = this.module.cwrap('lua_newstate', 'number', ['number', 'number']);
          this.lua_close = this.module.cwrap('lua_close', null, ['number']);
          this.lua_newthread = this.module.cwrap('lua_newthread', 'number', ['number']);
          this.lua_resetthread = this.module.cwrap('lua_resetthread', 'number', ['number']);
          this.lua_atpanic = this.module.cwrap('lua_atpanic', 'number', ['number', 'number']);
          this.lua_version = this.module.cwrap('lua_version', 'number', ['number']);
          this.lua_absindex = this.module.cwrap('lua_absindex', 'number', ['number', 'number']);
          this.lua_gettop = this.module.cwrap('lua_gettop', 'number', ['number']);
          this.lua_settop = this.module.cwrap('lua_settop', null, ['number', 'number']);
          this.lua_pushvalue = this.module.cwrap('lua_pushvalue', null, ['number', 'number']);
          this.lua_rotate = this.module.cwrap('lua_rotate', null, ['number', 'number', 'number']);
          this.lua_copy = this.module.cwrap('lua_copy', null, ['number', 'number', 'number']);
          this.lua_checkstack = this.module.cwrap('lua_checkstack', 'number', ['number', 'number']);
          this.lua_xmove = this.module.cwrap('lua_xmove', null, ['number', 'number', 'number']);
          this.lua_isnumber = this.module.cwrap('lua_isnumber', 'number', ['number', 'number']);
          this.lua_isstring = this.module.cwrap('lua_isstring', 'number', ['number', 'number']);
          this.lua_iscfunction = this.module.cwrap('lua_iscfunction', 'number', ['number', 'number']);
          this.lua_isinteger = this.module.cwrap('lua_isinteger', 'number', ['number', 'number']);
          this.lua_isuserdata = this.module.cwrap('lua_isuserdata', 'number', ['number', 'number']);
          this.lua_type = this.module.cwrap('lua_type', 'number', ['number', 'number']);
          this.lua_typename = this.module.cwrap('lua_typename', 'string', ['number', 'number']);
          this.lua_tonumberx = this.module.cwrap('lua_tonumberx', 'number', ['number', 'number', 'number']);
          this.lua_tointegerx = this.module.cwrap('lua_tointegerx', 'number', ['number', 'number', 'number']);
          this.lua_toboolean = this.module.cwrap('lua_toboolean', 'number', ['number', 'number']);
          this.lua_tolstring = this.module.cwrap('lua_tolstring', 'string', ['number', 'number', 'number']);
          this.lua_rawlen = this.module.cwrap('lua_rawlen', 'number', ['number', 'number']);
          this.lua_tocfunction = this.module.cwrap('lua_tocfunction', 'number', ['number', 'number']);
          this.lua_touserdata = this.module.cwrap('lua_touserdata', 'number', ['number', 'number']);
          this.lua_tothread = this.module.cwrap('lua_tothread', 'number', ['number', 'number']);
          this.lua_topointer = this.module.cwrap('lua_topointer', 'number', ['number', 'number']);
          this.lua_arith = this.module.cwrap('lua_arith', null, ['number', 'number']);
          this.lua_rawequal = this.module.cwrap('lua_rawequal', 'number', ['number', 'number', 'number']);
          this.lua_compare = this.module.cwrap('lua_compare', 'number', ['number', 'number', 'number', 'number']);
          this.lua_pushnil = this.module.cwrap('lua_pushnil', null, ['number']);
          this.lua_pushnumber = this.module.cwrap('lua_pushnumber', null, ['number', 'number']);
          this.lua_pushinteger = this.module.cwrap('lua_pushinteger', null, ['number', 'number']);
          this.lua_pushlstring = this.module.cwrap('lua_pushlstring', 'string', ['number', 'string', 'number']);
          this.lua_pushstring = this.module.cwrap('lua_pushstring', 'string', ['number', 'string']);
          this.lua_pushcclosure = this.module.cwrap('lua_pushcclosure', null, ['number', 'number', 'number']);
          this.lua_pushboolean = this.module.cwrap('lua_pushboolean', null, ['number', 'number']);
          this.lua_pushlightuserdata = this.module.cwrap('lua_pushlightuserdata', null, ['number', 'number']);
          this.lua_pushthread = this.module.cwrap('lua_pushthread', 'number', ['number']);
          this.lua_getglobal = this.module.cwrap('lua_getglobal', 'number', ['number', 'string']);
          this.lua_gettable = this.module.cwrap('lua_gettable', 'number', ['number', 'number']);
          this.lua_getfield = this.module.cwrap('lua_getfield', 'number', ['number', 'number', 'string']);
          this.lua_geti = this.module.cwrap('lua_geti', 'number', ['number', 'number', 'number']);
          this.lua_rawget = this.module.cwrap('lua_rawget', 'number', ['number', 'number']);
          this.lua_rawgeti = this.module.cwrap('lua_rawgeti', 'number', ['number', 'number', 'number']);
          this.lua_rawgetp = this.module.cwrap('lua_rawgetp', 'number', ['number', 'number', 'number']);
          this.lua_createtable = this.module.cwrap('lua_createtable', null, ['number', 'number', 'number']);
          this.lua_newuserdatauv = this.module.cwrap('lua_newuserdatauv', 'number', ['number', 'number', 'number']);
          this.lua_getmetatable = this.module.cwrap('lua_getmetatable', 'number', ['number', 'number']);
          this.lua_getiuservalue = this.module.cwrap('lua_getiuservalue', 'number', ['number', 'number', 'number']);
          this.lua_setglobal = this.module.cwrap('lua_setglobal', null, ['number', 'string']);
          this.lua_settable = this.module.cwrap('lua_settable', null, ['number', 'number']);
          this.lua_setfield = this.module.cwrap('lua_setfield', null, ['number', 'number', 'string']);
          this.lua_seti = this.module.cwrap('lua_seti', null, ['number', 'number', 'number']);
          this.lua_rawset = this.module.cwrap('lua_rawset', null, ['number', 'number']);
          this.lua_rawseti = this.module.cwrap('lua_rawseti', null, ['number', 'number', 'number']);
          this.lua_rawsetp = this.module.cwrap('lua_rawsetp', null, ['number', 'number', 'number']);
          this.lua_setmetatable = this.module.cwrap('lua_setmetatable', 'number', ['number', 'number']);
          this.lua_setiuservalue = this.module.cwrap('lua_setiuservalue', 'number', ['number', 'number', 'number']);
          this.lua_callk = this.module.cwrap('lua_callk', null, ['number', 'number', 'number', 'number', 'number']);
          this.lua_pcallk = this.module.cwrap('lua_pcallk', 'number', ['number', 'number', 'number', 'number', 'number', 'number']);
          this.lua_load = this.module.cwrap('lua_load', 'number', ['number', 'number', 'number', 'string', 'string']);
          this.lua_dump = this.module.cwrap('lua_dump', 'number', ['number', 'number', 'number', 'number']);
          this.lua_yieldk = this.module.cwrap('lua_yieldk', 'number', ['number', 'number', 'number', 'number']);
          this.lua_resume = this.module.cwrap('lua_resume', 'number', ['number', 'number', 'number', 'number']);
          this.lua_status = this.module.cwrap('lua_status', 'number', ['number']);
          this.lua_isyieldable = this.module.cwrap('lua_isyieldable', 'number', ['number']);
          this.lua_setwarnf = this.module.cwrap('lua_setwarnf', null, ['number', 'number', 'number']);
          this.lua_warning = this.module.cwrap('lua_warning', null, ['number', 'string', 'number']);
          this.lua_error = this.module.cwrap('lua_error', 'number', ['number']);
          this.lua_next = this.module.cwrap('lua_next', 'number', ['number', 'number']);
          this.lua_concat = this.module.cwrap('lua_concat', null, ['number', 'number']);
          this.lua_len = this.module.cwrap('lua_len', null, ['number', 'number']);
          this.lua_stringtonumber = this.module.cwrap('lua_stringtonumber', 'number', ['number', 'string']);
          this.lua_getallocf = this.module.cwrap('lua_getallocf', 'number', ['number', 'number']);
          this.lua_setallocf = this.module.cwrap('lua_setallocf', null, ['number', 'number', 'number']);
          this.lua_toclose = this.module.cwrap('lua_toclose', null, ['number', 'number']);
          this.lua_closeslot = this.module.cwrap('lua_closeslot', null, ['number', 'number']);
          this.lua_getstack = this.module.cwrap('lua_getstack', 'number', ['number', 'number', 'number']);
          this.lua_getinfo = this.module.cwrap('lua_getinfo', 'number', ['number', 'string', 'number']);
          this.lua_getlocal = this.module.cwrap('lua_getlocal', 'string', ['number', 'number', 'number']);
          this.lua_setlocal = this.module.cwrap('lua_setlocal', 'string', ['number', 'number', 'number']);
          this.lua_getupvalue = this.module.cwrap('lua_getupvalue', 'string', ['number', 'number', 'number']);
          this.lua_setupvalue = this.module.cwrap('lua_setupvalue', 'string', ['number', 'number', 'number']);
          this.lua_upvalueid = this.module.cwrap('lua_upvalueid', 'number', ['number', 'number', 'number']);
          this.lua_upvaluejoin = this.module.cwrap('lua_upvaluejoin', null, ['number', 'number', 'number', 'number', 'number']);
          this.lua_sethook = this.module.cwrap('lua_sethook', null, ['number', 'number', 'number', 'number']);
          this.lua_gethook = this.module.cwrap('lua_gethook', 'number', ['number']);
          this.lua_gethookmask = this.module.cwrap('lua_gethookmask', 'number', ['number']);
          this.lua_gethookcount = this.module.cwrap('lua_gethookcount', 'number', ['number']);
          this.lua_setcstacklimit = this.module.cwrap('lua_setcstacklimit', 'number', ['number', 'number']);
          this.luaopen_base = this.module.cwrap('luaopen_base', 'number', ['number']);
          this.luaopen_coroutine = this.module.cwrap('luaopen_coroutine', 'number', ['number']);
          this.luaopen_table = this.module.cwrap('luaopen_table', 'number', ['number']);
          this.luaopen_io = this.module.cwrap('luaopen_io', 'number', ['number']);
          this.luaopen_os = this.module.cwrap('luaopen_os', 'number', ['number']);
          this.luaopen_string = this.module.cwrap('luaopen_string', 'number', ['number']);
          this.luaopen_utf8 = this.module.cwrap('luaopen_utf8', 'number', ['number']);
          this.luaopen_math = this.module.cwrap('luaopen_math', 'number', ['number']);
          this.luaopen_debug = this.module.cwrap('luaopen_debug', 'number', ['number']);
          this.luaopen_package = this.module.cwrap('luaopen_package', 'number', ['number']);
          this.luaL_openlibs = this.module.cwrap('luaL_openlibs', null, ['number']);
      }
      static async initialize(customWasmFileLocation, environmentVariables) {
          const module = await initWasmModule({
              print: console.log,
              printErr: console.error,
              locateFile: (path,scriptDirectory)=>{
                  return customWasmFileLocation || scriptDirectory + path;
              }
              ,
              preRun: (initializedModule)=>{
                  if (typeof environmentVariables === 'object') {
                      Object.entries(environmentVariables).forEach(([k,v])=>(initializedModule.ENV[k] = v));
                  }
              }
              ,
          });
          return new LuaWasm(module);
      }
      lua_remove(luaState, index) {
          this.lua_rotate(luaState, index, -1);
          this.lua_pop(luaState, 1);
      }
      lua_pop(luaState, count) {
          this.lua_settop(luaState, -count - 1);
      }
      luaL_getmetatable(luaState, name) {
          return this.lua_getfield(luaState, LUA_REGISTRYINDEX, name);
      }
      lua_yield(luaState, count) {
          return this.lua_yieldk(luaState, count, 0, null);
      }
      lua_upvalueindex(index) {
          return LUA_REGISTRYINDEX - index;
      }
      ref(data) {
          const existing = this.referenceTracker.get(data);
          if (existing) {
              existing.refCount++;
              return existing.index;
          }
          const availableIndex = this.availableReferences.pop();
          const index = availableIndex === undefined ? this.referenceMap.size + 1 : availableIndex;
          this.referenceMap.set(index, data);
          this.referenceTracker.set(data, {
              refCount: 1,
              index,
          });
          this.lastRefIndex = index;
          return index;
      }
      unref(index) {
          const ref = this.referenceMap.get(index);
          if (ref === undefined) {
              return;
          }
          const metadata = this.referenceTracker.get(ref);
          if (metadata === undefined) {
              this.referenceTracker.delete(ref);
              this.availableReferences.push(index);
              return;
          }
          metadata.refCount--;
          if (metadata.refCount <= 0) {
              this.referenceTracker.delete(ref);
              this.referenceMap.delete(index);
              this.availableReferences.push(index);
          }
      }
      getRef(index) {
          return this.referenceMap.get(index);
      }
      getLastRefIndex() {
          return this.lastRefIndex;
      }
      printRefs() {
          for (const [key,value] of this.referenceMap.entries()) {
              console.log(key, value);
          }
      }
  }

  var version = '1.14.0';

  class LuaFactory {
      constructor(customWasmUri, environmentVariables) {
          var _a;
          this.customWasmUri = customWasmUri;
          this.environmentVariables = environmentVariables;
          this.luaWasmPromise = LuaWasm.initialize(this.customWasmUri, this.environmentVariables);
          if (this.customWasmUri === undefined) {
              const isBrowser = (typeof window === 'object' && typeof window.document !== 'undefined') || (typeof self === 'object' && ((_a = self === null || self === void 0 ? void 0 : self.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'DedicatedWorkerGlobalScope');
              if (isBrowser) {
                  const majorminor = version.slice(0, version.lastIndexOf('.'));
                  this.customWasmUri = 'https://ark-release-1251316161.file.myqcloud.com/wasmoon/glue.wasm';
              }
          }
      }
      async mountFile(path, content) {
          this.mountFileSync(await this.getLuaModule(), path, content);
      }
      mountFileSync(luaWasm, path, content) {
          const fileSep = path.lastIndexOf('/');
          const file = path.substring(fileSep + 1);
          const body = path.substring(0, path.length - file.length - 1);
          if (body.length > 0) {
              const parts = body.split('/').reverse();
              let parent = '';
              while (parts.length) {
                  const part = parts.pop();
                  if (!part) {
                      continue;
                  }
                  const current = `${parent}/${part}`;
                  try {
                      luaWasm.module.FS.mkdir(current);
                  } catch (err) {}
                  parent = current;
              }
          }
          luaWasm.module.FS.writeFile(path, content);
      }
      async createEngine(options={}) {
          return new LuaEngine(await this.getLuaModule(),options);
      }
      async getLuaModule() {
          return this.luaWasmPromise;
      }
  }

  exports.Decoration = Decoration;
  exports.LUAI_MAXSTACK = LUAI_MAXSTACK;
  exports.LUA_MULTRET = LUA_MULTRET;
  exports.LUA_REGISTRYINDEX = LUA_REGISTRYINDEX;
  exports.LuaEngine = LuaEngine;
  exports.LuaFactory = LuaFactory;
  exports.LuaGlobal = Global;
  exports.LuaMultiReturn = MultiReturn;
  exports.LuaRawResult = RawResult;
  exports.LuaThread = Thread;
  exports.LuaTimeoutError = LuaTimeoutError;
  exports.LuaTypeExtension = LuaTypeExtension;
  exports.LuaWasm = LuaWasm;
  exports.PointerSize = PointerSize;
  exports.decorate = decorate;
  exports.decorateFunction = decorateFunction;
  exports.decorateProxy = decorateProxy;
  exports.decorateUserdata = decorateUserdata;

  Object.defineProperty(exports, '__esModule', {
      value: true
  });

}
));
