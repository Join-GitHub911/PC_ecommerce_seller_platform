# 后端响应格式实现指南

本文档提供了后端开发人员在实现API接口时应当遵循的响应格式规范和建议实现方式。

## 统一响应格式结构

根据前后端响应格式约定，所有API接口的响应必须遵循以下标准格式：

```json
{
  "code": 200,         // 状态码：200成功，非200为错误码
  "message": "成功",    // 状态描述信息
  "data": { ... },     // 业务数据（可选）
  "pagination": {...}  // 分页信息（可选）
}
```

## 实现方法

### 创建统一响应实体类

```java
// 通用响应类
public class ApiResponse<T> {
    private int code;               // 状态码
    private String message;         // 消息
    private T data;                 // 数据
    private Pagination pagination;  // 分页信息（可选）

    // 构造函数
    public ApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    // 带分页的构造函数
    public ApiResponse(int code, String message, T data, Pagination pagination) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.pagination = pagination;
    }

    // 创建成功响应（不带数据）
    public static ApiResponse<Void> success() {
        return new ApiResponse<>(200, "操作成功", null);
    }

    // 创建成功响应（带数据）
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "操作成功", data);
    }

    // 创建成功响应（带自定义消息和数据）
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }

    // 创建带分页的成功响应
    public static <T> ApiResponse<T> success(T data, Pagination pagination) {
        return new ApiResponse<>(200, "操作成功", data, pagination);
    }

    // 创建错误响应
    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }

    // getter 和 setter 方法
    // ...
}

// 分页信息类
public class Pagination {
    private long total;      // 总记录数
    private int current;     // 当前页码
    private int pageSize;    // 每页大小

    // 构造函数
    public Pagination(long total, int current, int pageSize) {
        this.total = total;
        this.current = current;
        this.pageSize = pageSize;
    }

    // getter 和 setter 方法
    // ...
}
```

### 全局统一响应处理

使用拦截器或切面编程实现全局响应格式处理，确保所有API接口返回标准格式：

```java
// 响应结果处理切面
@Aspect
@Component
public class ResponseResultAspect {

    @Pointcut("execution(* com.example.controller..*.*(..))")
    public void controllerPointcut() {}

    @Around("controllerPointcut()")
    public Object handleResponseResult(ProceedingJoinPoint pjp) throws Throwable {
        Object result = pjp.proceed();
        
        // 如果返回结果已经是ApiResponse类型，直接返回
        if (result instanceof ApiResponse) {
            return result;
        }
        
        // 否则，包装成ApiResponse统一格式
        return ApiResponse.success(result);
    }
}
```

### 全局异常处理

实现全局异常处理器，确保所有异常都返回标准错误响应格式：

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 处理业务逻辑异常
    @ExceptionHandler(BusinessException.class)
    public ApiResponse<?> handleBusinessException(BusinessException e) {
        return ApiResponse.error(e.getCode(), e.getMessage());
    }

    // 处理参数验证异常
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<?> handleValidationException(MethodArgumentNotValidException e) {
        StringBuilder errorMsg = new StringBuilder("参数验证失败: ");
        e.getBindingResult().getFieldErrors().forEach(error -> 
            errorMsg.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("; ")
        );
        return ApiResponse.error(422, errorMsg.toString());
    }

    // 处理未授权异常
    @ExceptionHandler(UnauthorizedException.class)
    public ApiResponse<?> handleUnauthorized(UnauthorizedException e) {
        return ApiResponse.error(401, "未授权，请先登录");
    }

    // 处理权限不足异常
    @ExceptionHandler(ForbiddenException.class)
    public ApiResponse<?> handleForbidden(ForbiddenException e) {
        return ApiResponse.error(403, "权限不足，无法访问");
    }

    // 处理资源不存在异常
    @ExceptionHandler(NotFoundException.class)
    public ApiResponse<?> handleNotFound(NotFoundException e) {
        return ApiResponse.error(404, e.getMessage());
    }

    // 处理所有其他异常
    @ExceptionHandler(Exception.class)
    public ApiResponse<?> handleAllException(Exception e) {
        log.error("未捕获的异常", e);
        return ApiResponse.error(500, "服务器内部错误");
    }
}
```

## 使用案例

### 用户注册接口实现

```java
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ApiResponse<AuthData> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // 检查用户名是否已存在
            if (userService.isUsernameExists(request.getUsername())) {
                return ApiResponse.error(422, "用户名已存在，请更换其他用户名");
            }
            
            // 处理注册逻辑
            AuthData authData = userService.register(request);
            
            // 返回成功响应
            return ApiResponse.success("注册成功", authData);
        } catch (Exception e) {
            return ApiResponse.error(500, "注册失败: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ApiResponse<AuthData> login(@Valid @RequestBody LoginRequest request) {
        try {
            // 验证用户凭据
            AuthData authData = userService.login(request.getUsername(), request.getPassword());
            
            // 返回成功响应
            return ApiResponse.success("登录成功", authData);
        } catch (InvalidCredentialsException e) {
            return ApiResponse.error(401, "用户名或密码错误");
        } catch (Exception e) {
            return ApiResponse.error(500, "登录失败: " + e.getMessage());
        }
    }

    @PostMapping("/sendSmsCode")
    public ApiResponse<Void> sendVerificationCode(@RequestBody PhoneRequest request) {
        try {
            // 发送验证码
            userService.sendVerificationCode(request.getPhone());
            
            // 返回成功响应
            return ApiResponse.success("验证码已发送");
        } catch (Exception e) {
            return ApiResponse.error(500, "发送验证码失败: " + e.getMessage());
        }
    }
}
```

### 商品列表接口实现

```java
@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ApiResponse<List<ProductDto>> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword) {
        
        // 查询商品列表
        PageResult<ProductDto> pageResult = productService.getProducts(page, pageSize, keyword);
        
        // 创建分页信息
        Pagination pagination = new Pagination(
                pageResult.getTotal(),
                page,
                pageSize
        );
        
        // 返回带分页的成功响应
        return ApiResponse.success(pageResult.getList(), pagination);
    }
}
```

## 最佳实践

1. **始终使用统一响应格式**：所有API接口必须返回符合规范的响应格式。

2. **使用明确的状态码**：按照约定使用正确的状态码，不要随意定义新状态码。

3. **提供有意义的错误消息**：错误响应中应提供有助于调试和用户理解的错误信息。

4. **做好日志记录**：记录响应和异常情况，便于问题排查。

5. **保持数据结构一致性**：同类型的接口应保持数据结构的一致性，不要频繁变更。

6. **使用统一的工具类**：创建响应工具类统一处理响应格式，避免重复代码。

## 常见问题

1. **Q: 如何处理嵌套数据结构？**
   A: 在 data 字段中可以包含任意复杂的嵌套数据结构，只要保证最外层响应格式符合规范即可。

2. **Q: 空响应如何处理？**
   A: 对于没有返回数据的成功响应，可以省略 data 字段或设置为 null。

3. **Q: 如何处理文件下载等二进制响应？**
   A: 文件下载等二进制响应可以例外，不需要包装成标准 JSON 格式。

## 结论

统一的响应格式是前后端协作的基础，后端开发人员应严格遵循本文档中的规范和建议，确保所有API接口返回一致的响应格式，提高系统的稳定性和可维护性。 