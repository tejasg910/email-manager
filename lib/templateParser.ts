export const parseTemplate = (template: string, data: { resumeUrl: string, githubUrl: string }) => {
  return template
    .replace('{{RESUME_URL}}', data.resumeUrl)
    .replace('{{GITHUB_URL}}', data.githubUrl)
    .replace('{{PORTFOLIO_URL}}', "https://tejasgiri-portfolio.vercel.app")
}

export const emailTemplates = [
  {
    name: 'Full Stack Engineer',
    html: `
       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
  <p>Dear Hiring Manager,</p>

  <p>I am Tejas Giri, a dedicated Full Stack Engineer with over two years of experience building robust and scalable web applications using the MERN stack and Next.js. I excel at creating seamless user experiences, writing efficient code, and optimizing application performance, achieving up to 92% improvement through advanced optimization techniques.</p>

  <p>Highlights of my expertise include:</p>
  <ul>
    <li>Strong command of React.js, Node.js, and MongoDB for full-stack development.</li>
    <li>Proficient in integrating APIs and implementing secure authentication mechanisms.</li>
    <li>Experience in delivering scalable, user-centric solutions for enterprise-level projects.</li>
  </ul>

  <p>I invite you to explore my work:</p>
  <p><a href="{{RESUME_URL}}" style="text-decoration: none; color: #0073e6;">View My Resume</a></p>
  <p><a href="{{GITHUB_URL}}" style="text-decoration: none; color: #0073e6;">Visit My GitHub Profile</a></p>

  <p>Thank you for considering my application. I am excited about the opportunity to contribute my skills and grow with your team.</p>

  <p>Warm regards,</p>
  <p><strong>Tejas Giri</strong><br>+91-7620529876</p>
</div>

      `
  },
  {
    name: 'Frontend Engineer',
    html: `
       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
  <p>Dear Hiring Manager,</p>

  <p>My name is Tejas Giri, and I am passionate about crafting visually appealing and high-performing user interfaces. As a Frontend Engineer with extensive experience in React.js, Next.js, and TypeScript, I have developed scalable applications that provide exceptional user experiences.</p>

  <p>Some of my achievements include:</p>
  <ul>
    <li>Building responsive, accessible, and SEO-friendly UIs using modern CSS frameworks.</li>
    <li>Developing enterprise-level AR/VR platforms with real-time capabilities.</li>
    <li>Optimizing frontend performance to ensure fast load times and smooth navigation.</li>
  </ul>

  <p>Discover more about me:</p>
  <p><a href="{{RESUME_URL}}" style="text-decoration: none; color: #0073e6;">View My Resume</a></p>
  <p><a href="{{GITHUB_URL}}" style="text-decoration: none; color: #0073e6;">Visit My GitHub Profile</a></p>

  <p>Thank you for reviewing my application. I am eager to bring my skills and creativity to your team and help build impactful solutions.</p>

  <p>Sincerely,</p>
  <p><strong>Tejas Giri</strong><br>+91-7620529876</p>
</div>

      `
  },
  {
    name: 'Backend Engineer',
    html: `
       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
  <p>Dear Hiring Manager,</p>

  <p>I am Tejas Giri, a Backend Engineer with expertise in building robust server-side systems using Node.js and Express.js. I specialize in designing RESTful APIs, managing databases, and implementing secure authentication protocols to create reliable, scalable applications.</p>

  <p>Here’s a glimpse of what I bring to the table:</p>
  <ul>
    <li>Proven experience in designing microservices architecture for complex systems.</li>
    <li>Expertise in SQL and NoSQL databases for efficient data management.</li>
    <li>Integrating third-party APIs and tools to enhance functionality and performance.</li>
  </ul>

  <p>Explore more about my work:</p>
  <p><a href="{{RESUME_URL}}" style="text-decoration: none; color: #0073e6;">View My Resume</a></p>
  <p><a href="{{GITHUB_URL}}" style="text-decoration: none; color: #0073e6;">Visit My GitHub Profile</a></p>

  <p>I would love the opportunity to contribute my skills to your organization and help achieve its goals. Thank you for considering my application.</p>

  <p>Best regards,</p>
  <p><strong>Tejas Giri</strong><br>+91-7620529876</p>
</div>

      `
  }
]