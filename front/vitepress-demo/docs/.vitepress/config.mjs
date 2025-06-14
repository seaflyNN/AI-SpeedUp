import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "CRM 项目文档",
  description: "CRM 系统的完整文档",
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '常见问题', link: '/faq/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '功能特性', link: '/guide/features' },
            { text: '最佳实践', link: '/guide/best-practices' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 文档',
          items: [
            { text: '接口概览', link: '/api/overview' },
            { text: '认证授权', link: '/api/auth' },
            { text: '客户管理', link: '/api/customers' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/your-repo' }
    ]
  }
}) 