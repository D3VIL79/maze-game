import React, { useState, useEffect, useRef } from 'react';
import { FileText, User, Briefcase, GraduationCap, Award, Download, Eye, Save, MapPin } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeBuilder = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [
      {
        id: 1,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ],
    education: [
      {
        id: 1,
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }
    ],
    skills: [],
    certifications: []
  });
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const resumeRef = useRef(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/resume/templates');
      setTemplates(response.data.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleInputChange = (section, field, value, index = null) => {
    if (index !== null) {
      setResumeData(prev => ({
        ...prev,
        [section]: prev[section].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    }
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    const skill = prompt('Enter a skill:');
    if (skill && skill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const downloadResumeAsPDF = async () => {
    if (!resumeRef.current) return;

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${resumeData.personalInfo.firstName || 'Resume'}_${resumeData.personalInfo.lastName || 'Document'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/resume/builder', resumeData);
      alert('Resume created successfully! You can now download it as PDF.');
      console.log('Resume analysis:', response.data.data.analysis);
    } catch (error) {
      alert('Failed to create resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { name: 'Personal Info', icon: User },
    { name: 'Experience', icon: Briefcase },
    { name: 'Education', icon: GraduationCap },
    { name: 'Skills', icon: Award },
    { name: 'Template', icon: FileText }
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={resumeData.personalInfo.firstName}
            onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
            className="input-field"
            placeholder="Rahul"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={resumeData.personalInfo.lastName}
            onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
            className="input-field"
            placeholder="Sharma"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            className="input-field"
            placeholder="rahul.sharma@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={resumeData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            className="input-field"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          Location
        </label>
        <input
          type="text"
          value={resumeData.personalInfo.location}
          onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
          className="input-field"
          placeholder="Mumbai, Maharashtra"
        />
        <p className="text-xs text-gray-500 mt-1">Popular Indian cities: Mumbai, Bangalore, Delhi, Hyderabad, Pune, Chennai</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
        <textarea
          value={resumeData.personalInfo.summary}
          onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)}
          className="input-field"
          rows={4}
          placeholder="Brief professional summary highlighting your key strengths and career objectives for the Indian job market..."
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Work Experience</h3>
        <button onClick={addExperience} className="btn-secondary">
          <Briefcase className="w-4 h-4 mr-2" />
          Add Experience
        </button>
      </div>

      {resumeData.experience.map((exp, index) => (
        <div key={exp.id} className="card">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-medium text-gray-900">Experience #{index + 1}</h4>
            {resumeData.experience.length > 1 && (
              <button
                onClick={() => removeExperience(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                className="input-field"
                placeholder="TCS, Infosys, Wipro, HCL, Tech Mahindra"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => handleInputChange('experience', 'position', e.target.value, index)}
                className="input-field"
                placeholder="Software Engineer, Senior Developer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => handleInputChange('experience', 'startDate', e.target.value, index)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => handleInputChange('experience', 'endDate', e.target.value, index)}
                className="input-field"
                disabled={exp.current}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) => handleInputChange('experience', 'current', e.target.checked, index)}
                className="mr-2"
              />
              <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700">
                Current Position
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={exp.description}
              onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
              className="input-field"
              rows={3}
              placeholder="Describe your responsibilities and achievements in the Indian context..."
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Education</h3>
        <button onClick={addEducation} className="btn-secondary">
          <GraduationCap className="w-4 h-4 mr-2" />
          Add Education
        </button>
      </div>

      {resumeData.education.map((edu, index) => (
        <div key={edu.id} className="card">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-medium text-gray-900">Education #{index + 1}</h4>
            {resumeData.education.length > 1 && (
              <button
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                className="input-field"
                placeholder="IIT, NIT, BITS, Delhi University, Mumbai University"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                className="input-field"
                placeholder="B.Tech, B.E., M.Tech, MCA, BCA"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => handleInputChange('education', 'field', e.target.value, index)}
                className="input-field"
                placeholder="Computer Science, Information Technology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => handleInputChange('education', 'startDate', e.target.value, index)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => handleInputChange('education', 'endDate', e.target.value, index)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CGPA/Percentage (Optional)</label>
            <input
              type="text"
              value={edu.gpa}
              onChange={(e) => handleInputChange('education', 'gpa', e.target.value, index)}
              className="input-field"
              placeholder="8.5/10 or 85%"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
        <button onClick={addSkill} className="btn-secondary">
          <Award className="w-4 h-4 mr-2" />
          Add Skill
        </button>
      </div>

      <div className="card">
        <p className="text-sm text-gray-600 mb-4">
          Add your technical and soft skills relevant to the Indian job market. These will be used to match you with relevant job opportunities.
        </p>
        
        {resumeData.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="badge badge-primary">
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No skills added yet. Click "Add Skill" to get started.</p>
        )}
      </div>
    </div>
  );

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Choose Template</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`card cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'ring-2 ring-primary-500 bg-primary-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">{template.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
            <span className="badge badge-secondary text-xs">{template.category}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderExperience();
      case 2: return renderEducation();
      case 3: return renderSkills();
      case 4: return renderTemplateSelection();
      default: return null;
    }
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-primary-100 rounded-lg mr-4">
            <FileText className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-gray-600 mt-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Create a professional resume for the Indian job market
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            
            return (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : isCompleted
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {isCompleted ? (
                    <span className="text-sm font-bold">✓</span>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="card mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={activeStep === 0}
          className={`btn-secondary ${activeStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="btn-secondary"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Hide Preview' : 'Preview'}
          </button>

          {activeStep === steps.length - 1 && (
            <button
              onClick={downloadResumeAsPDF}
              className="btn-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          )}

          {activeStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Creating...' : 'Create Resume'}
            </button>
          ) : (
            <button onClick={nextStep} className="btn-primary">
              Next
            </button>
          )}
        </div>
      </div>

      {/* Preview Mode */}
      {previewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Resume Preview</h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadResumeAsPDF}
                    className="btn-secondary text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => setPreviewMode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div ref={resumeRef} className="border rounded-lg p-6 bg-gray-50">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                  </h1>
                  <p className="text-gray-600">{resumeData.personalInfo.email}</p>
                  <p className="text-gray-600">{resumeData.personalInfo.phone}</p>
                  <p className="text-gray-600">{resumeData.personalInfo.location}</p>
                </div>

                {resumeData.personalInfo.summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Summary</h2>
                    <p className="text-gray-700">{resumeData.personalInfo.summary}</p>
                  </div>
                )}

                {resumeData.experience.some(exp => exp.company) && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Experience</h2>
                    {resumeData.experience.map((exp, index) => (
                      exp.company && (
                        <div key={index} className="mb-4">
                          <h3 className="font-medium text-gray-900">{exp.position}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </p>
                          {exp.description && (
                            <p className="text-gray-700 mt-2">{exp.description}</p>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {resumeData.education.some(edu => edu.institution) && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
                    {resumeData.education.map((edu, index) => (
                      edu.institution && (
                        <div key={index} className="mb-4">
                          <h3 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h3>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">
                            {edu.startDate} - {edu.endDate}
                          </p>
                          {edu.gpa && (
                            <p className="text-sm text-gray-500">CGPA/Percentage: {edu.gpa}</p>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {resumeData.skills.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <span key={index} className="badge badge-primary">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
