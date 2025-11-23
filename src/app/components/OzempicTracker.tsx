"use client";

import { useState, useEffect } from "react";
import { Syringe, Calendar, TrendingDown, AlertCircle, Plus, Activity, Scale, Heart } from "lucide-react";

interface OzempicApplication {
  date: string;
  dose: number;
  applicationSite: string;
  sideEffects: string[];
  notes: string;
}

interface OzempicData {
  isUsing: boolean;
  startDate: string;
  currentDose: number;
  frequency: string;
  applications: OzempicApplication[];
  weight: { date: string; value: number }[];
  sideEffectsHistory: string[];
  goals: string;
  doctorNotes: string;
}

export function OzempicTracker() {
  const [ozempicData, setOzempicData] = useState<OzempicData>({
    isUsing: false,
    startDate: "",
    currentDose: 0.25,
    frequency: "weekly",
    applications: [],
    weight: [],
    sideEffectsHistory: [],
    goals: "",
    doctorNotes: "",
  });

  const [showAddApplication, setShowAddApplication] = useState(false);
  const [newApplication, setNewApplication] = useState<OzempicApplication>({
    date: "",
    dose: 0.25,
    applicationSite: "",
    sideEffects: [],
    notes: "",
  });

  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState({ date: "", value: 0 });

  useEffect(() => {
    const saved = localStorage.getItem("ozempicData");
    if (saved) {
      setOzempicData(JSON.parse(saved));
    }
  }, []);

  const saveOzempicData = (data: OzempicData) => {
    setOzempicData(data);
    localStorage.setItem("ozempicData", JSON.stringify(data));
  };

  const addApplication = () => {
    if (!newApplication.date || !newApplication.applicationSite) return;
    
    const applications = [...ozempicData.applications, newApplication].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    saveOzempicData({ ...ozempicData, applications });
    setNewApplication({
      date: "",
      dose: ozempicData.currentDose,
      applicationSite: "",
      sideEffects: [],
      notes: "",
    });
    setShowAddApplication(false);
  };

  const addWeight = () => {
    if (!newWeight.date || !newWeight.value) return;
    
    const weight = [...ozempicData.weight, newWeight].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    saveOzempicData({ ...ozempicData, weight });
    setNewWeight({ date: "", value: 0 });
    setShowAddWeight(false);
  };

  const getNextApplicationDate = () => {
    if (ozempicData.applications.length === 0) return null;
    const lastApp = ozempicData.applications[0];
    const lastDate = new Date(lastApp.date);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 7); // Semanal
    return nextDate;
  };

  const getWeightProgress = () => {
    if (ozempicData.weight.length < 2) return null;
    const sorted = [...ozempicData.weight].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const first = sorted[0].value;
    const last = sorted[sorted.length - 1].value;
    return (first - last).toFixed(1);
  };

  const applicationSites = [
    "Abdômen",
    "Coxa (frente)",
    "Coxa (lateral)",
    "Braço (parte superior)",
  ];

  const commonSideEffects = [
    "Náusea",
    "Vômito",
    "Diarreia",
    "Constipação",
    "Dor abdominal",
    "Fadiga",
    "Tontura",
    "Dor de cabeça",
    "Perda de apetite",
  ];

  const doseOptions = [0.25, 0.5, 1.0, 1.7, 2.4];

  const nextApplication = getNextApplicationDate();
  const weightProgress = getWeightProgress();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Syringe className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Monitoramento Ozempic</h2>
        </div>
        <p className="text-teal-100">Acompanhe aplicações, doses e resultados</p>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Status do Tratamento</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isUsing"
              checked={ozempicData.isUsing}
              onChange={(e) => saveOzempicData({ ...ozempicData, isUsing: e.target.checked })}
              className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
            />
            <label htmlFor="isUsing" className="text-gray-700 dark:text-gray-300 font-medium">
              Estou usando Ozempic
            </label>
          </div>

          {ozempicData.isUsing && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data de Início do Tratamento
                </label>
                <input
                  type="date"
                  value={ozempicData.startDate}
                  onChange={(e) => saveOzempicData({ ...ozempicData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dose Atual (mg)
                </label>
                <select
                  value={ozempicData.currentDose}
                  onChange={(e) => saveOzempicData({ ...ozempicData, currentDose: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200"
                >
                  {doseOptions.map((dose) => (
                    <option key={dose} value={dose}>
                      {dose} mg
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequência
                </label>
                <select
                  value={ozempicData.frequency}
                  onChange={(e) => saveOzempicData({ ...ozempicData, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200"
                >
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quinzenal</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {ozempicData.isUsing && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Próxima Aplicação</span>
              </div>
              {nextApplication ? (
                <div>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {Math.ceil((nextApplication.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {nextApplication.toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Registre primeira aplicação</p>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total de Aplicações</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {ozempicData.applications.length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progresso de Peso</span>
              </div>
              {weightProgress ? (
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    -{weightProgress} kg
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Desde o início</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Registre seu peso</p>
              )}
            </div>
          </div>

          {/* Applications Log */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Registro de Aplicações</h3>
              <button
                onClick={() => setShowAddApplication(!showAddApplication)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Nova Aplicação</span>
              </button>
            </div>

            {showAddApplication && (
              <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
                  <input
                    type="date"
                    value={newApplication.date}
                    onChange={(e) => setNewApplication({ ...newApplication, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dose (mg)</label>
                  <select
                    value={newApplication.dose}
                    onChange={(e) => setNewApplication({ ...newApplication, dose: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {doseOptions.map((dose) => (
                      <option key={dose} value={dose}>
                        {dose} mg
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Local de Aplicação</label>
                  <select
                    value={newApplication.applicationSite}
                    onChange={(e) => setNewApplication({ ...newApplication, applicationSite: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="">Selecione...</option>
                    {applicationSites.map((site) => (
                      <option key={site} value={site}>
                        {site}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Efeitos Colaterais</label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {commonSideEffects.map((effect) => (
                      <label key={effect} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newApplication.sideEffects.includes(effect)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewApplication({
                                ...newApplication,
                                sideEffects: [...newApplication.sideEffects, effect],
                              });
                            } else {
                              setNewApplication({
                                ...newApplication,
                                sideEffects: newApplication.sideEffects.filter((s) => s !== effect),
                              });
                            }
                          }}
                          className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{effect}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações</label>
                  <textarea
                    value={newApplication.notes}
                    onChange={(e) => setNewApplication({ ...newApplication, notes: e.target.value })}
                    placeholder="Anotações sobre a aplicação..."
                    className="w-full h-20 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200 resize-none"
                  />
                </div>

                <button
                  onClick={addApplication}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Salvar Aplicação
                </button>
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {ozempicData.applications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Nenhuma aplicação registrada</p>
              ) : (
                ozempicData.applications.map((app, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Syringe className="w-5 h-5 text-teal-500" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {new Date(app.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                        {app.dose} mg
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Local: {app.applicationSite}
                    </p>
                    {app.sideEffects.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {app.sideEffects.map((effect, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full"
                          >
                            {effect}
                          </span>
                        ))}
                      </div>
                    )}
                    {app.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">{app.notes}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weight Tracking */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Acompanhamento de Peso</h3>
              <button
                onClick={() => setShowAddWeight(!showAddWeight)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Registrar Peso</span>
              </button>
            </div>

            {showAddWeight && (
              <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
                  <input
                    type="date"
                    value={newWeight.date}
                    onChange={(e) => setNewWeight({ ...newWeight, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight.value || ""}
                    onChange={(e) => setNewWeight({ ...newWeight, value: parseFloat(e.target.value) })}
                    placeholder="Ex: 70.5"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <button
                  onClick={addWeight}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Salvar Peso
                </button>
              </div>
            )}

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {ozempicData.weight.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum registro de peso</p>
              ) : (
                ozempicData.weight.map((w, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Scale className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {new Date(w.date).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{w.value} kg</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Goals and Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Objetivos do Tratamento</h3>
            <textarea
              value={ozempicData.goals}
              onChange={(e) => saveOzempicData({ ...ozempicData, goals: e.target.value })}
              placeholder="Descreva seus objetivos com o tratamento..."
              className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200 resize-none mb-4"
            />

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Orientações Médicas</h3>
            <textarea
              value={ozempicData.doctorNotes}
              onChange={(e) => saveOzempicData({ ...ozempicData, doctorNotes: e.target.value })}
              placeholder="Registre orientações do seu médico..."
              className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-gray-200 resize-none"
            />
          </div>

          {/* Important Info */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Informações Importantes</h3>
                <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                  <li>• Sempre siga as orientações do seu médico</li>
                  <li>• Alterne os locais de aplicação para evitar reações</li>
                  <li>• Mantenha o medicamento refrigerado</li>
                  <li>• Registre todos os efeitos colaterais e comunique ao médico</li>
                  <li>• Não altere a dose sem orientação médica</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {!ozempicData.isUsing && (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-2xl p-8 text-center">
          <Syringe className="w-16 h-16 text-teal-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Monitoramento de Ozempic
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Marque a opção acima quando iniciar o tratamento com Ozempic para começar a monitorar
            aplicações, doses e resultados.
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            ⚠️ Ozempic deve ser usado apenas com prescrição e acompanhamento médico
          </p>
        </div>
      )}
    </div>
  );
}
