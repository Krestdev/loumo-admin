"use client";

import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/providers/datastore";
import SettingQuery from "@/queries/setting";
import TopicQuery from "@/queries/topic";
import { Faq, Setting, Topic } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import {
  CircleQuestionMark,
  Eye,
  Monitor,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Settings,
  Trash
} from "lucide-react";
import { useEffect, useState } from "react";
import AddQA from "./addQA";
import AddTopic from "./addTopic";
import DeleteQA from "./deleteQA";
import DeleteTopic from "./deleteTopic";
import EditQA from "./editQA";
import EditTopic from "./editTopic";
import AddPage from "./addPage";

export default function SettingsPage() {
  //settings
  const settingsQuery = new SettingQuery();
  const getSettings = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  //topic
  const topicQuery = new TopicQuery();
  const getTopics = useQuery({
    queryKey: ["topics"],
    queryFn: () => topicQuery.getAll(),
    refetchOnWindowFocus: false,
  });

  const [settings, setSettings] = useState<Setting[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [addQADialog, setAddQADialog] = useState<boolean>(false);
  const [addTopicDialog, setAddTopicDialog] = useState<boolean>(false);
  const [editTopicDialog, setEditTopicDialog] = useState<boolean>(false);
  const [deleteTopicDialog, setDeleteTopicDialog] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic>();

  const [selectedFAQ, setSelectedFAQ] = useState<Faq>();
  const [deleteFAQDialog, setDeleteFAQDialog] = useState<boolean>(false);
  const [editFAQ, setEditFAQ] = useState<boolean>(false);

  const [addPageDialog, setAddPageDialog] = useState<boolean>(false);

  const { setLoading } = useStore();

  useEffect(() => {
    setLoading(getSettings.isLoading || getTopics.isLoading);
    if (getSettings.isSuccess) setSettings(getSettings.data);
    if (getTopics.isSuccess) setTopics(getTopics.data);
  }, [
    setLoading,
    getSettings.isLoading,
    getTopics.isLoading,
    getSettings.isSuccess,
    getTopics.isSuccess,
    getSettings.data,
    getTopics.data,
    setSettings,
    setTopics,
  ]);

  const handleAddQA = (topic: Topic): void => {
    setSelectedTopic(topic);
    setAddQADialog(true);
  };

  const handleDeleteQA = (faq: Faq): void => {
    setSelectedFAQ(faq);
    setDeleteFAQDialog(true);
  };

  const handleDeleteTopic = (topic: Topic): void => {
    setSelectedTopic(topic);
    setDeleteTopicDialog(true);
  };

  const handleEditQA = (faq: Faq): void => {
    setSelectedFAQ(faq);
    setEditFAQ(true);
  };

  const handleEditTopic = (topic: Topic): void => {
    setSelectedTopic(topic);
    setEditTopicDialog(true);
  };

  return (
    <PageLayout
      isLoading={getSettings.isLoading || getTopics.isLoading}
      className="flex-1 space-y-4 p-4 md:p-8 pt-6"
    >
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">{"Général"}</TabsTrigger>
          <TabsTrigger value="FAQ">{"FAQ"}</TabsTrigger>
          <TabsTrigger value="pages">{"Pages"}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>{"Informations Générales"}</span>
                </CardTitle>
                <CardDescription>
                  {"Configurez les paramètres de base de votre plateforme"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">
                      {"Nom de l'entreprise"}
                    </Label>
                    <Input id="company-name" defaultValue="Oumoul" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">{"Site web"}</Label>
                    <Input id="website" defaultValue="https://oumoul.ma" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{"Description"}</Label>
                  <Textarea
                    id="description"
                    defaultValue="Plateforme e-commerce spécialisée dans la vente en gros de produits alimentaires et ménagers au Maroc."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{"Téléphone principal"}</Label>
                    <Input id="phone" defaultValue="+212 522 123 456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{"Email de contact"}</Label>
                    <Input id="email" defaultValue="contact@oumoul.ma" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{"Adresse du siège"}</Label>
                  <Textarea
                    id="address"
                    defaultValue="123 Avenue Mohammed V, Casablanca 20000, Maroc"
                    className="min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline">{"Annuler"}</Button>
            <Button>{"Enregistrer les modifications"}</Button>
          </div>
        </TabsContent>

        <TabsContent value="FAQ" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CircleQuestionMark className="h-5 w-5" />
                <span>{"Paramètres de FAQ"}</span>
              </CardTitle>
              <CardDescription>
                {"Gérez les questions réponses de la page FAQ"}
              </CardDescription>
              <div className="mt-4">
                <Button
                  className="w-fit"
                  onClick={() => setAddTopicDialog(true)}
                >
                  <PlusCircle size={16} className="mr-2" />
                  {"Ajouter une section"}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 mt-4">
              {selectedTopic && (
                <AddQA
                  isOpen={addQADialog}
                  openChange={setAddQADialog}
                  topic={selectedTopic}
                />
              )}
              {selectedTopic && (
                <EditTopic
                  isOpen={editTopicDialog}
                  openChange={setEditTopicDialog}
                  topic={selectedTopic}
                />
              )}
              {selectedTopic && (
                <DeleteTopic
                  isOpen={deleteTopicDialog}
                  openChange={setDeleteTopicDialog}
                  topic={selectedTopic}
                />
              )}
              <AddTopic
                isOpen={addTopicDialog}
                openChange={setAddTopicDialog}
              />
              {selectedFAQ && (
                <DeleteQA
                  QA={selectedFAQ}
                  isOpen={deleteFAQDialog}
                  openChange={setDeleteFAQDialog}
                />
              )}
              {selectedFAQ && (
                <EditQA
                  topics={topics}
                  QA={selectedFAQ}
                  isOpen={editFAQ}
                  openChange={setEditFAQ}
                />
              )}

              {topics.length === 0 ? (
                <div className="flex flex-col py-4 items-center text-center text-muted-foreground">
                  <p className="text-base sm:text-lg italic">
                    {"Aucun topic n’a encore été créé."}
                  </p>
                  <p>
                    {
                      "Ajoutez un topic pour commencer à organiser vos questions fréquentes."
                    }
                  </p>
                  <Button
                    size={"lg"}
                    className="mt-3"
                    onClick={() => setAddTopicDialog(true)}
                  >
                    {"Créer une section"}
                  </Button>
                </div>
              ) : (
                topics.map((topic) => (
                  <Card key={topic.id}>
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle>{topic.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size={"sm"} variant={"outline"}>
                            {"Actions"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleEditTopic(topic)}
                          >
                            <Pencil size={16} />
                            {"Modifier la section"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDeleteTopic(topic)}
                          >
                            <Trash size={16} />
                            {"Supprimer la section"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                      {topic.faqs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {"Aucune question pour cette section."}
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{"Question"}</TableHead>
                              <TableHead>{"Réponse"}</TableHead>
                              <TableHead className="text-right">
                                {"Actions"}
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {topic.faqs.map((faq) => (
                              <TableRow key={faq.id}>
                                <TableCell>{faq.question}</TableCell>
                                <TableCell className="max-w-sm truncate">
                                  {faq.answer}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button size={"icon"} variant={"ghost"}>
                                        <MoreHorizontal size={16} />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem
                                        onClick={() => handleEditQA(faq)}
                                      >
                                        <Pencil size={16} />
                                        {"Modifier"}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() => handleDeleteQA(faq)}
                                      >
                                        <Trash size={16} />
                                        {"Supprimer"}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                      <Button
                        size="sm"
                        variant={"secondary"}
                        onClick={() => handleAddQA(topic)}
                      >
                        <PlusCircle className="mr-2" size={16} />
                        {"Ajouter une Question/Réponse"}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <AddPage isOpen={addPageDialog} openChange={setAddPageDialog} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor size={20} />
                <span>{"Pages complémentaires"}</span>
              </CardTitle>
              <CardDescription>
                {"Configurer les pages additionnelles du site web"}
              </CardDescription>
              <Button size="sm" className="w-fit" onClick={()=>setAddPageDialog(true)}>
                <PlusCircle size={16} />
                {"Ajouter une page"}
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {settings.filter((s) => s.section === "page").length === 0 ? (
                <div className="text-center text-muted-foreground mt-10">
                  <p>{"Aucune page n’a encore été créée."}</p>
                  <p>{"Utilisez le bouton ci-dessus pour en ajouter une."}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{"Titre"}</TableHead>
                      <TableHead>{"Meta description"}</TableHead>
                      <TableHead className="text-right">{"Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settings
                      .filter((s) => s.section === "page")
                      .map((page) => (
                        <TableRow key={page.id}>
                          <TableCell>{page.name}</TableCell>
                          <TableCell className="max-w-sm truncate">
                            {page.note || "-"}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="icon" variant="ghost">
                              <Eye size={16} />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Pencil size={16} />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Trash className="w-4 h-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
