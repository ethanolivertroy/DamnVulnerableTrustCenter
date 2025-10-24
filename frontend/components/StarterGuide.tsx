'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  CloudIcon,
  KeyIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface GuideTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: any;
}

interface GuideSection {
  id: string;
  title: string;
  subtitle: string;
  tasks: GuideTask[];
}

export default function StarterGuide() {
  const [isVisible, setIsVisible] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['intro', 'connect']);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    // Load saved state from localStorage
    const saved = localStorage.getItem('dvtc_starter_guide');
    if (saved) {
      const data = JSON.parse(saved);
      setIsVisible(data.visible ?? true);
      setCompletedTasks(data.completedTasks || []);
    }
  }, []);

  const saveState = (visible: boolean, tasks: string[]) => {
    localStorage.setItem('dvtc_starter_guide', JSON.stringify({
      visible,
      completedTasks: tasks
    }));
  };

  const sections: GuideSection[] = [
    {
      id: 'intro',
      title: 'Intro to DVTC',
      subtitle: 'Learn about your frameworks and how DVTC works to meet your security and compliance needs.',
      tasks: [
        {
          id: 'tour',
          title: 'Take a product tour',
          description: 'Get familiar with the platform',
          completed: false,
          icon: UserIcon
        }
      ]
    },
    {
      id: 'connect',
      title: 'Connect your key systems',
      subtitle: 'Connecting integrations enables DVTC to automate evidence collection and monitoring for you.',
      tasks: [
        {
          id: 'aws',
          title: 'Connect AWS account',
          description: 'Link your AWS services',
          completed: false,
          icon: CloudIcon
        },
        {
          id: 'github',
          title: 'Connect GitHub',
          description: 'Link your code repositories',
          completed: false,
          icon: KeyIcon
        },
        {
          id: 'okta',
          title: 'Connect Okta',
          description: 'Set up SSO integration',
          completed: false,
          icon: KeyIcon
        },
        {
          id: 'slack',
          title: 'Connect Slack',
          description: 'Enable notifications',
          completed: false,
          icon: KeyIcon
        }
      ]
    },
    {
      id: 'policies',
      title: 'Launch policies and procedures',
      subtitle: 'A successful audit requires proper documentation, which includes a concise set of policies.',
      tasks: [
        {
          id: 'verify',
          title: 'Verify your company name and logo',
          description: 'Update your organization details',
          completed: false,
          icon: DocumentTextIcon
        },
        {
          id: 'draft',
          title: 'Draft & approve remaining policies',
          description: 'Complete your policy library',
          completed: false,
          icon: DocumentTextIcon
        }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleTask = (taskId: string) => {
    const newTasks = completedTasks.includes(taskId)
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];
    setCompletedTasks(newTasks);
    saveState(isVisible, newTasks);
  };

  const hideGuide = () => {
    setIsVisible(false);
    saveState(false, completedTasks);
  };

  const getCompletedCount = () => {
    const allTasks = sections.flatMap(s => s.tasks);
    return allTasks.filter(t => completedTasks.includes(t.id)).length;
  };

  const getTotalTasks = () => {
    return sections.flatMap(s => s.tasks).length;
  };

  const getProgress = () => {
    const total = getTotalTasks();
    const completed = getCompletedCount();
    return total > 0 ? (completed / total) * 100 : 0;
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Finish Starter Guide</h2>
            <span className="text-red-200">{getCompletedCount()}/{getTotalTasks()} tasks completed</span>
          </div>
          <button
            onClick={hideGuide}
            className="text-red-200 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-sm text-red-200 mb-2">Welcome to DVTC!</div>
          <p className="text-sm text-red-100">
            Accelerate your account setup and audit prep. Pick up where you left off and check out our in-app help resources if you get stuck.
          </p>
        </div>

        {/* Progress Circles */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">{getCompletedCount()} of {getTotalTasks()}</div>
            <span className="text-red-200">key systems connected</span>
          </div>
          <div className="flex-1 bg-red-800 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-3">
          {sections.map((section) => {
            const sectionCompleted = section.tasks.every(t => completedTasks.includes(t.id));
            const sectionProgress = section.tasks.filter(t => completedTasks.includes(t.id)).length;

            return (
              <div key={section.id} className="bg-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {sectionCompleted ? (
                        <CheckCircleSolid className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-red-300" />
                      )}
                      <h3 className="font-semibold">{section.title}</h3>
                    </div>
                    <span className="text-sm text-red-200">
                      {sectionProgress} of {section.tasks.length} complete
                    </span>
                  </div>
                  {expandedSections.includes(section.id) ? (
                    <ChevronUpIcon className="w-5 h-5" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.includes(section.id) && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <p className="text-sm text-red-100 mb-3">{section.subtitle}</p>
                        <div className="space-y-2">
                          {section.tasks.map((task) => {
                            const Icon = task.icon;
                            const isCompleted = completedTasks.includes(task.id);

                            return (
                              <div
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                              >
                                <div className="mt-0.5">
                                  {isCompleted ? (
                                    <CheckCircleSolid className="w-5 h-5 text-green-400" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-red-300" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className={`font-medium ${isCompleted ? 'line-through opacity-70' : ''}`}>
                                    {task.title}
                                  </div>
                                  <div className={`text-sm text-red-200 ${isCompleted ? 'line-through opacity-70' : ''}`}>
                                    {task.description}
                                  </div>
                                </div>
                                <Icon className="w-5 h-5 text-red-300" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}