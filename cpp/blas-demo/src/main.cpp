#include <iostream>
#include <vector>
#include <iomanip>
#include <cblas.h>

void print_matrix(const std::vector<double>& matrix, int rows, int cols, const std::string& name) {
    std::cout << name << ":\n";
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            std::cout << std::setw(8) << std::fixed << std::setprecision(2) 
                      << matrix[i * cols + j] << " ";
        }
        std::cout << "\n";
    }
    std::cout << "\n";
}

int main() {
    std::cout << "=== OpenBLAS 矩阵运算演示 ===\n\n";

    // 定义矩阵维度
    const int M = 3; // A的行数
    const int N = 3; // B的列数  
    const int K = 3; // A的列数 = B的行数

    // 初始化矩阵 A (3x3)
    std::vector<double> A = {
        1.0, 2.0, 3.0,
        4.0, 5.0, 6.0,
        7.0, 8.0, 9.0
    };

    // 初始化矩阵 B (3x3)
    std::vector<double> B = {
        9.0, 8.0, 7.0,
        6.0, 5.0, 4.0,
        3.0, 2.0, 1.0
    };

    // 结果矩阵 C (3x3)
    std::vector<double> C(M * N, 0.0);

    // 打印输入矩阵
    print_matrix(A, M, K, "矩阵 A");
    print_matrix(B, K, N, "矩阵 B");

    // 使用 OpenBLAS 进行矩阵乘法: C = A * B
    // cblas_dgemm(layout, transA, transB, M, N, K, alpha, A, lda, B, ldb, beta, C, ldc)
    cblas_dgemm(CblasRowMajor,       // 行主序存储
                CblasNoTrans,         // A不转置
                CblasNoTrans,         // B不转置
                M,                    // A的行数
                N,                    // B的列数
                K,                    // A的列数/B的行数
                1.0,                  // alpha = 1.0
                A.data(),             // 矩阵A
                K,                    // A的leading dimension
                B.data(),             // 矩阵B
                N,                    // B的leading dimension
                0.0,                  // beta = 0.0
                C.data(),             // 结果矩阵C
                N                     // C的leading dimension
    );

    // 打印结果
    print_matrix(C, M, N, "结果矩阵 C = A × B");

    // 演示向量运算 - 向量点积
    std::cout << "=== 向量点积演示 ===\n\n";
    
    std::vector<double> x = {1.0, 2.0, 3.0, 4.0, 5.0};
    std::vector<double> y = {5.0, 4.0, 3.0, 2.0, 1.0};
    
    std::cout << "向量 x: ";
    for (double val : x) {
        std::cout << val << " ";
    }
    std::cout << "\n";
    
    std::cout << "向量 y: ";
    for (double val : y) {
        std::cout << val << " ";
    }
    std::cout << "\n";

    // 计算点积 x · y
    double dot_product = cblas_ddot(x.size(), x.data(), 1, y.data(), 1);
    
    std::cout << "点积 x · y = " << dot_product << "\n\n";

    // 演示向量缩放
    std::cout << "=== 向量缩放演示 ===\n\n";
    std::vector<double> z = {1.0, 2.0, 3.0, 4.0, 5.0};
    
    std::cout << "原始向量 z: ";
    for (double val : z) {
        std::cout << val << " ";
    }
    std::cout << "\n";
    
    // 向量缩放: z = 2.5 * z
    cblas_dscal(z.size(), 2.5, z.data(), 1);
    
    std::cout << "缩放后 z (× 2.5): ";
    for (double val : z) {
        std::cout << val << " ";
    }
    std::cout << "\n\n";

    std::cout << "OpenBLAS 演示完成！\n";
    
    return 0;
} 